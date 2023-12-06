module addr_songStore::songStore {

    use aptos_std::table::{Self, Table};
    use addr_on_chain_radio::user::Account;
    // use addr_on_chain_radio::song::Song;
    use std::vector;
    // use std::resource_account;
    use std::signer;
    use std::string::{String, utf8};

    #[test_only]
    use std::account;

    //------To be imported from song module------
    struct Song has store {
        artist_wallet_address: address,
        title: String,
        ipfs_hash: String,
        total_tips: u64,
        duration: u8,
        premium: bool,
        genre: String,
        reports: u64,
    }
    //-------------------------------------------

    struct SongStore has key {
        premium_songs: SongLibrary,
        free_songs: SongLibrary,
        premium_artists: Table<u64, Account>,
        num_premium_artists: u64,
        new_arrivals: NewArrivals,
        trending_songs: TrendingSongs,
    }

    struct SongLibrary has store {
        songs: Table<u8, Genre>,
        num_genre: u8,
        genre_list: vector<String>,
    }

    struct Genre has store {
        songs: Table<u64, Song>,
        num_songs: u64,
    }

    struct NewArrivals has store {
        songs: Table<u8, Song>,
        num_songs: u8,
        max_songs: u8,
        oldest_song: u8,
    }

    struct TrendingSongs has store {
        songs: Table<u8, Song>,
        num_songs: u8,
        max_songs: u8,
        least_trending: u8,
    }

    fun init_module(resource_signer: &signer) {
        // let _genre_list = vector["Rock", "Pop", "Hip Hop", "Classical", "Jazz"];
        let _genre_list = vector[utf8(b"Rock"), utf8(b"Pop"), utf8(b"Hip Hop"), utf8(b"Classical"), utf8(b"Jazz")];
        let song_store = SongStore {
            premium_songs: SongLibrary {
                songs: table::new(),
                num_genre: (vector::length(&_genre_list) as u8),
                genre_list: _genre_list,
            },

            free_songs: SongLibrary {
                songs: table::new(),
                num_genre: (vector::length(&_genre_list) as u8),
                genre_list: _genre_list,
            },

            premium_artists: table::new(),
            num_premium_artists: 0,

            new_arrivals: NewArrivals {
                songs: table::new(),
                num_songs: 0,
                max_songs: 10,
                oldest_song: 0,
            },

            trending_songs: TrendingSongs {
                songs: table::new(),
                num_songs: 0,
                max_songs: 10,
                least_trending: 0,
            }
        };

        move_to(resource_signer, song_store);
    }

    #[test(resource_acc = @0x123)]
    public entry fun test_init_songStore(resource_acc: &signer) {
        let resource_acc_addr = signer::address_of(resource_acc);
        account::create_account_for_test(resource_acc_addr);
        assert!(!exists<SongStore>(resource_acc_addr), 1);
        init_module(resource_acc);
        assert!(exists<SongStore>(resource_acc_addr), 2);
    }
}