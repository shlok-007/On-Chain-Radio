module addr_on_chain_radio::user{

    use std::string::{String, utf8};
    use std::signer;
    use std::vector;
    use 0x1::coin;
    use 0x1::aptos_coin::AptosCoin; 
    use 0x1::aptos_account;
    use addr_on_chain_radio::community;
    use std::timestamp;

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

    const ACC_ALREADY_EXISTS: u64 = 100;
    const ALREADY_SUBSCRIBED: u64 = 101;
    const INSUFFICIENT_FUNDS: u64 = 102;
    const NO_ACCOUNT: u64 = 103;

    const SUBSCRIPTION_DURATION: u64 = 2592000; // 30 days in seconds
    
    struct Account has key, store, drop {
        wallet_address: address,
        name: String,
        email: String,
        bio: Bio,
        premium: bool,
        subscription_expiry: u64
    }

    struct Bio has store, drop {
        location: String,
        profession: String,
        about: String,
        profile_img_hash: String
    }

    public entry fun create_account(account: &signer, _name: String, _email: String){
        let _wallet_address = signer::address_of(account);
        assert!(!exists<Account>(_wallet_address), ACC_ALREADY_EXISTS);
        let new_account = Account{
            wallet_address: _wallet_address,
            name: _name,
            email: _email,
            bio: Bio{
                location: utf8(b""),
                profession: utf8(b""),
                about: utf8(b""),
                profile_img_hash: utf8(b"")
            },
            premium: false,
            subscription_expiry: 0
        };
        move_to(account, new_account);
    }

    public entry fun subscribe_to_premium(account: &signer) acquires Account{
        let signer_address = signer::address_of(account);
        assert!(exists<Account>(signer_address), NO_ACCOUNT);
        let acc = borrow_global_mut<Account>(signer_address);
        assert!(!acc.premium, ALREADY_SUBSCRIBED);
        let acc_balance = coin::balance<AptosCoin>(signer_address);
        let premium_price = community::get_premium_price();
        assert!(acc_balance >= premium_price, INSUFFICIENT_FUNDS);
        
        let premium_artists: vector<address> = addr_on_chain_radio::songStore::get_premium_artists_list();
        let num_premium_artists: u64 = vector::length(&premium_artists);
        if(num_premium_artists == 0){
            aptos_account::transfer(account, @admin, premium_price);
            return
        };

        let premium_artist_cut_percentage : u64 = (community::get_artist_premium_cut() as u64);
        let admin_cut = premium_price - premium_price*premium_artist_cut_percentage/100;
        aptos_account::transfer(account, @admin, admin_cut);

        let i = 0;
        let per_artist_cut: u64 = (premium_artist_cut_percentage*premium_price)/(100*num_premium_artists);

        while(i < num_premium_artists){
            let artist_address = *vector::borrow(&premium_artists, i);
            aptos_account::transfer(account, artist_address, per_artist_cut);
            i = i + 1;
        };

        acc.premium = true;
        acc.subscription_expiry = timestamp::now_seconds() + SUBSCRIPTION_DURATION;
    }

    public entry fun validate_subscription(account: &signer) acquires Account{
        let signer_address = signer::address_of(account);
        assert!(exists<Account>(signer_address), NO_ACCOUNT);
        let acc = borrow_global_mut<Account>(signer_address);
        assert!(acc.subscription_expiry < timestamp::now_seconds(), ALREADY_SUBSCRIBED);
        acc.premium = false;
    }

    public entry fun update_bio(account: &signer, _location: String, _profession: String, _about: String, _profile_img_hash: String) acquires Account {
        let signer_address = signer::address_of(account);
        assert!(exists<Account>(signer_address), NO_ACCOUNT);
        let acc = borrow_global_mut<Account>(signer_address);
        acc.bio.location = _location;
        acc.bio.profession = _profession;
        acc.bio.about = _about;
        acc.bio.profile_img_hash = _profile_img_hash;
    }

    public entry fun remove_account(account: &signer) acquires Account {
        let signer_address = signer::address_of(account);
        assert!(exists<Account>(signer_address), NO_ACCOUNT);
        move_from<Account>(signer_address);
    }

    #[view]
    public fun check_acc_exists(_address: address): bool {
        return exists<Account>(_address)
    }

    #[test(acc1 = @0x123, aptos_framework = @0x1)]

    public entry fun create_account_and_subscribe_to_premium_test(acc1: &signer, aptos_framework: &signer) acquires Account{
        // set up global time for testing purpose
        timestamp::set_time_has_started_for_testing(aptos_framework);
        timestamp::update_global_time_for_test_secs(10);
        print(&utf8(b"Before time: "));
        let _before_time = timestamp::now_seconds();
        print(&_before_time);
        let (_burn_cap, _mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);
        let aptos_framework_address = signer::address_of(aptos_framework);
        account::create_account_for_test(aptos_framework_address);
        let acc = account::create_account_for_test(signer::address_of(acc1));
        coin::register<AptosCoin>(&acc);

        let customer_address: address = signer::address_of(acc1);
        let premium_price = community::get_premium_price();
        aptos_coin::mint(aptos_framework, customer_address, premium_price+20);
        create_account(acc1, string::utf8(b"John Doe"), string::utf8(b"john123@gmail.com"));
        assert!(exists<Account>(customer_address), 90);
        print(&utf8(b"Balance before subscription: "));
        print(&coin::balance<AptosCoin>(customer_address));
        assert!(!borrow_global<Account>(customer_address).premium, 91);

        subscribe_to_premium(acc1);

        assert!(borrow_global<Account>(customer_address).premium, 92);
        print(&utf8(b"Balance after subscription: "));
        print(&coin::balance<AptosCoin>(customer_address));
        print(&utf8(b"After time: "));
        let _after_time = timestamp::now_seconds();
        print(&_after_time);
        coin::destroy_burn_cap(_burn_cap);
        coin::destroy_mint_cap(_mint_cap);
    }

    #[test(test_acc = @0x123)]
    public entry fun update_bio_test(test_acc: &signer) acquires Account{
        let test_acc_address = signer::address_of(test_acc);
        account::create_account_for_test(signer::address_of(test_acc));
        create_account(test_acc, string::utf8(b"John Doe"), string::utf8(b"john123@gmail.com"));
        let acc = borrow_global<Account>(test_acc_address);
        print(&utf8(b"Bio before update: "));
        print(&acc.bio.location);
        print(&acc.bio.profession);
        print(&acc.bio.about);
        update_bio(test_acc, string::utf8(b"New York"), string::utf8(b"Musician"), string::utf8(b"I am a musician"));
        assert!(borrow_global<Account>(test_acc_address).bio.location == string::utf8(b"New York"), 93);
        assert!(borrow_global<Account>(test_acc_address).bio.profession == string::utf8(b"Musician"), 94);
        assert!(borrow_global<Account>(test_acc_address).bio.about == string::utf8(b"I am a musician"), 95);
        acc = borrow_global<Account>(test_acc_address);
        print(&utf8(b"Bio after update: "));
        print(&acc.bio.location);
        print(&acc.bio.profession);
        print(&acc.bio.about);
    }
}