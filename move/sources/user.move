module addr_on_chain_radio::user{

    use std::string::{String, utf8};
    use std::signer;
    use aptos_std::table::{Self, Table};
    use std::vector;
    use 0x1::coin;
    use 0x1::aptos_coin::AptosCoin; 
    use 0x1::aptos_account;

    //-----To be moved to community module-----//
    const Premium_fee: u64 = 1000;
    const Premium_artist_cut_percentage: u64 = 60;
    //----------------------------------------//

    const NO_ACCOUNT: u64 = 0;
    const ALREADY_SUBSCRIBED: u64 = 1;
    const INSUFFICIENT_FUNDS: u64 = 2;
    
    struct Account has key {
        wallet_address: address,
        name: String,
        email: String,
        bio: Bio,
        premium: bool,
        tips_given: TipsGiven
    }

    struct TipsGiven has store {
        num_tips: u64,
        tips: Table<u64, TipGiven>
    }

    struct TipGiven has store {
        artist_name: String,
        artist_address: address,
        song_title: String,
        tip_amount: u64,
        tip_date: String
    }

    struct Bio has store {
        location: String,
        profession: String,
        about: String
    }

    public entry fun create_account(account: &signer, _name: String, _email: String, _premium: bool){
        let _wallet_address = signer::address_of(account);
        let new_account = Account{
            wallet_address: _wallet_address,
            name: _name,
            email: _email,
            bio: Bio{
                location: utf8(b""),
                profession: utf8(b""),
                about: utf8(b"")
            },
            premium: _premium,
            tips_given: TipsGiven{
                num_tips: 0,
                tips: table::new()
            }
        };
        move_to(account, new_account);
    }

    public entry fun subscribe_to_premium(account: &signer) acquires Account{
        let signer_address = signer::address_of(account);
        assert!(exists<Account>(signer_address), NO_ACCOUNT);
        let acc = borrow_global_mut<Account>(signer_address);
        assert!(!acc.premium, ALREADY_SUBSCRIBED);
        let acc_balance = coin::balance<AptosCoin>(signer_address);
        assert!(acc_balance >= Premium_fee, INSUFFICIENT_FUNDS);

        let admin_cut = Premium_fee - Premium_fee*Premium_artist_cut_percentage/100;
        aptos_account::transfer(account, @admin_address, admin_cut);

        let i = 0;
        //-------To be fetched from SongStore module-------//
        let premium_artists: vector<address> = vector[@0x10, @0x11, @0x12, @0x13, @0x14, @0x15];
        let num_premium_artists: u64 = vector::length(&premium_artists);
        let per_artist_cut: u64 = (Premium_artist_cut_percentage*Premium_fee)/(100*num_premium_artists);
        //------------------------------------------------//
        while(i < num_premium_artists){
            let artist_address = *vector::borrow(&premium_artists, i);
            aptos_account::transfer(account, artist_address, per_artist_cut);
            i = i+1;
        };

        acc.premium = true;
    }

    public entry fun update_bio(account: &signer, _location: String, _profession: String, _about: String) acquires Account {
        let signer_address = signer::address_of(account);
        assert!(exists<Account>(signer_address), NO_ACCOUNT);
        let acc = borrow_global_mut<Account>(signer_address);
        acc.bio.location = _location;
        acc.bio.profession = _profession;
        acc.bio.about = _about;
    }

    #[test_only]
    use std::string;
    #[test_only]
    use std::debug::print;
    #[test_only]
    use 0x1::aptos_coin;
    #[test_only]
    use std::timestamp;
    #[test_only]
    use aptos_framework::account;

    #[test(acc1 = @0x123, aptos_framework = @0x1)]

    public entry fun create_account_and_subscribe_to_premium_test(acc1: &signer, aptos_framework: &signer) acquires Account{
        // set up global time for testing purpose
        timestamp::set_time_has_started_for_testing(aptos_framework);
        timestamp::update_global_time_for_test_secs(10);
        let (_burn_cap, _mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);
        let aptos_framework_address = signer::address_of(aptos_framework);
        account::create_account_for_test(aptos_framework_address);
        let acc = account::create_account_for_test(signer::address_of(acc1));
        coin::register<AptosCoin>(&acc);

        let customer_address: address = signer::address_of(acc1);
        aptos_coin::mint(aptos_framework, customer_address, Premium_fee+20);
        create_account(acc1, string::utf8(b"John Doe"), string::utf8(b"john123@gmail.com"), false);
        assert!(exists<Account>(customer_address), 90);
        print(&utf8(b"Balance before subscription: "));
        print(&coin::balance<AptosCoin>(customer_address));
        assert!(!borrow_global<Account>(customer_address).premium, 91);

        subscribe_to_premium(acc1);

        assert!(borrow_global<Account>(customer_address).premium, 92);
        print(&utf8(b"Balance after subscription: "));
        print(&coin::balance<AptosCoin>(customer_address));

        coin::destroy_burn_cap(_burn_cap);
        coin::destroy_mint_cap(_mint_cap);
    }
}