module addr_community::community {

    use std::string::String;
    use std::timestamp;
    use std::account;
    use std::account::SignerCapability;
    use std::resource_account;
    use std::vector;
    use std::signer;

    const POLL_ALREADY_EXISTS: u64 = 400;
    const POLL_DOES_NOT_EXIST: u64 = 401;
    const POLL_NOT_ENDED: u64 = 402;
    const POLL_HAS_ENDED: u64 = 403;
    const INVALID_PROPOSED_CUT: u64 = 404;
    const ALREADY_VOTED: u64 = 405;
    const INVALID_POLL_TYPE: u64 = 406;
    const INVALID_PREMIUM_PRICE: u64 = 407;
    const INVALID_REPORT_THRESHOLD: u64 = 408;

    // const POLL_DURATION: u64 = 604800; // 1 week in seconds
    const POLL_DURATION: u64 = 60; // 1 min for testing

    struct CommunityParams has key {
        artist_premium_cut: u8,
        artist_gen_cut: u8,
        premium_price: u64,
        report_threshold: u64,
        signer_cap: SignerCapability
    }

    fun init_module(community_signer: &signer){
        let _signer_cap = resource_account::retrieve_resource_account_cap(community_signer, @admin);
        let community_params = CommunityParams {
            artist_premium_cut: 70,
            artist_gen_cut: 60,
            premium_price: 1000,
            report_threshold: 10,
            signer_cap: _signer_cap
        };
        move_to(community_signer, community_params);
    }

    struct Poll4ArtistPremiumCut has key, drop {
        proposed_cut: u8,
        justification: String,
        votes_for: u64,
        votes_against: u64,
        end_time: u64,
        voters: vector<address>
    }

    struct Poll4ArtistGenCut has key, drop {
        proposed_cut: u8,
        justification: String,
        votes_for: u64,
        votes_against: u64,
        end_time: u64,
        voters: vector<address>
    }

    struct Poll4PremiumPrice has key, drop {
        proposed_price: u64,
        justification: String,
        votes_for: u64,
        votes_against: u64,
        end_time: u64,
        voters: vector<address>
    }

    struct Poll4ReportThreshold has key, drop {
        proposed_threshold: u64,
        justification: String,
        votes_for: u64,
        votes_against: u64,
        end_time: u64,
        voters: vector<address>
    }

    public entry fun create_poll (
        proposed_value: u64,
        justification: String,
        poll_type: u8) acquires CommunityParams {

        let community_signer = account::create_signer_with_capability(&borrow_global_mut<CommunityParams>(@addr_community).signer_cap);
        
        if(poll_type == 0) {
            assert!(!exists<Poll4ArtistPremiumCut>(@addr_community), POLL_ALREADY_EXISTS);
            assert!(proposed_value >= 0, INVALID_PROPOSED_CUT);
            assert!(proposed_value <= 100, INVALID_PROPOSED_CUT);

            let poll = Poll4ArtistPremiumCut {
                proposed_cut: (proposed_value as u8),
                justification: justification,
                votes_for: 0,
                votes_against: 0,
                end_time: timestamp::now_seconds()+POLL_DURATION,
                voters: vector::empty<address>()
            };
            move_to(&community_signer, poll);
        }
        else if(poll_type == 1) {
            assert!(!exists<Poll4ArtistGenCut>(@addr_community), POLL_ALREADY_EXISTS);
            assert!(proposed_value >= 0, INVALID_PROPOSED_CUT);
            assert!(proposed_value <= 100, INVALID_PROPOSED_CUT);

            let poll = Poll4ArtistGenCut {
                proposed_cut: (proposed_value as u8),
                justification: justification,
                votes_for: 0,
                votes_against: 0,
                end_time: timestamp::now_seconds()+POLL_DURATION,
                voters: vector::empty<address>()
            };
            move_to(&community_signer, poll);
        }
        else if(poll_type == 2) {
            assert!(!exists<Poll4PremiumPrice>(@addr_community), POLL_ALREADY_EXISTS);
            assert!(proposed_value >= 0, INVALID_PREMIUM_PRICE);

            let poll = Poll4PremiumPrice {
                proposed_price: proposed_value,
                justification: justification,
                votes_for: 0,
                votes_against: 0,
                end_time: timestamp::now_seconds()+POLL_DURATION,
                voters: vector::empty<address>()
            };
            move_to(&community_signer, poll);
        }
        else if(poll_type == 3) {
            assert!(!exists<Poll4ReportThreshold>(@addr_community), POLL_ALREADY_EXISTS);
            assert!(proposed_value >= 0, INVALID_REPORT_THRESHOLD);

            let poll = Poll4ReportThreshold {
                proposed_threshold: proposed_value,
                justification: justification,
                votes_for: 0,
                votes_against: 0,
                end_time: timestamp::now_seconds()+POLL_DURATION,
                voters: vector::empty<address>()
            };
            move_to(&community_signer, poll);
        }
        else {
            assert!(false, INVALID_POLL_TYPE);
        };
    }

    public entry fun vote(voter: &signer, vote: bool, poll_type: u8) acquires Poll4ArtistPremiumCut, Poll4ArtistGenCut, Poll4PremiumPrice, Poll4ReportThreshold {
        let voter_address = signer::address_of(voter);
        if(poll_type == 0) {
            assert!(exists<Poll4ArtistPremiumCut>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4ArtistPremiumCut>(@addr_community);
            assert!(poll_data.end_time >= timestamp::now_seconds(), POLL_HAS_ENDED);
            assert!(!vector::contains(&poll_data.voters, &voter_address), ALREADY_VOTED);
            if(vote) {
                poll_data.votes_for = poll_data.votes_for + 1;
            }
            else {
                poll_data.votes_against = poll_data.votes_against + 1;
            };
            vector::push_back(&mut poll_data.voters, voter_address);
        }
        else if(poll_type == 1) {
            assert!(exists<Poll4ArtistGenCut>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4ArtistGenCut>(@addr_community);
            assert!(poll_data.end_time >= timestamp::now_seconds(), POLL_HAS_ENDED);
            assert!(!vector::contains(&poll_data.voters, &voter_address), ALREADY_VOTED);
            if(vote) {
                poll_data.votes_for = poll_data.votes_for + 1;
            }
            else {
                poll_data.votes_against = poll_data.votes_against + 1;
            };
            vector::push_back(&mut poll_data.voters, voter_address);
        }
        else if(poll_type == 2) {
            assert!(exists<Poll4PremiumPrice>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4PremiumPrice>(@addr_community);
            assert!(poll_data.end_time >= timestamp::now_seconds(), POLL_HAS_ENDED);
            assert!(!vector::contains(&poll_data.voters, &voter_address), ALREADY_VOTED);
            if(vote) {
                poll_data.votes_for = poll_data.votes_for + 1;
            }
            else {
                poll_data.votes_against = poll_data.votes_against + 1;
            };
            vector::push_back(&mut poll_data.voters, voter_address);
        }
        else if(poll_type == 3) {
            assert!(exists<Poll4ReportThreshold>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4ReportThreshold>(@addr_community);
            assert!(poll_data.end_time >= timestamp::now_seconds(), POLL_HAS_ENDED);
            assert!(!vector::contains(&poll_data.voters, &voter_address), ALREADY_VOTED);
            if(vote) {
                poll_data.votes_for = poll_data.votes_for + 1;
            }
            else {
                poll_data.votes_against = poll_data.votes_against + 1;
            };
            vector::push_back(&mut poll_data.voters, voter_address);
        }
        else {
            assert!(false, INVALID_POLL_TYPE);
        };
    }

    public entry fun end_poll(poll_type: u8) acquires Poll4ArtistPremiumCut, Poll4ArtistGenCut, Poll4PremiumPrice, Poll4ReportThreshold, CommunityParams {
        
        let community_params = borrow_global_mut<CommunityParams>(@addr_community);
        if(poll_type == 0) {
            assert!(exists<Poll4ArtistPremiumCut>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4ArtistPremiumCut>(@addr_community);
            assert!(poll_data.end_time < timestamp::now_seconds(), POLL_NOT_ENDED);
            if(poll_data.votes_for > poll_data.votes_against) {
                community_params.artist_premium_cut = poll_data.proposed_cut;
            };
            move_from<Poll4ArtistPremiumCut>(@addr_community);
        }
        else if(poll_type == 1) {
            assert!(exists<Poll4ArtistGenCut>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4ArtistGenCut>(@addr_community);
            assert!(poll_data.end_time < timestamp::now_seconds(), POLL_NOT_ENDED);
            if(poll_data.votes_for > poll_data.votes_against) {
                community_params.artist_gen_cut = poll_data.proposed_cut;
            };
            move_from<Poll4ArtistGenCut>(@addr_community);
        }
        else if(poll_type == 2) {
            assert!(exists<Poll4PremiumPrice>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4PremiumPrice>(@addr_community);
            assert!(poll_data.end_time < timestamp::now_seconds(), POLL_NOT_ENDED);
            if(poll_data.votes_for > poll_data.votes_against) {
                community_params.premium_price = poll_data.proposed_price;
            };
            move_from<Poll4PremiumPrice>(@addr_community);
        }
        else if(poll_type == 3) {
            assert!(exists<Poll4ReportThreshold>(@addr_community), POLL_DOES_NOT_EXIST);
            let poll_data = borrow_global_mut<Poll4ReportThreshold>(@addr_community);
            assert!(poll_data.end_time < timestamp::now_seconds(), POLL_NOT_ENDED);
            if(poll_data.votes_for > poll_data.votes_against) {
                community_params.report_threshold = poll_data.proposed_threshold;
            };
            move_from<Poll4ReportThreshold>(@addr_community);
        }
        else {
            assert!(false, INVALID_POLL_TYPE);
        };
    }

    #[view]
    public fun get_report_threshold(): u64 acquires CommunityParams {
        return borrow_global<CommunityParams>(@addr_community).report_threshold
    }

    #[test(comm_acc = @0x7c6874c9aec6b7393e3575f40787bdfc7bd5f56c000135332730edc355bad22a)]
    public entry fun test_poll4_artist_premium_cut(comm_acc: &signer) {
        let comm_acc_addr = signer::address_of(comm_acc);
        account::create_account_for_test(comm_acc_addr);
        resource_account::create_resource_account(comm_acc, vector::empty<u8>(), vector::empty<u8>());
        assert!(!exists<CommunityParams>(comm_acc_addr), 1);
        init_module(comm_acc);
        assert!(exists<CommunityParams>(comm_acc_addr), 2);
    }
}