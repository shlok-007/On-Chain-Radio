module addr_res_acc_ocr::songStore {

    use aptos_std::table::{Self, Table};
    // use addr_on_chain_radio::song::Song;
    use std::vector;
    use std::signer;
    use std::string::{String, utf8};

    #[test_only]
    use std::account;

    const ACCOUNT_DOESNT_EXIST: u64 = 300;
    const INVALID_GENRE: u64 = 301;
    const UNAUTHORIZED: u64 = 302;
    const SONG_DIDNT_CROSS_REPORT_THRESHOLD: u64 = 303;

    //------To be imported from song module------
    struct Song has store, drop, copy {
        song_store_ID: u64,
        my_songs_ID: u64,
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
        premium_artists: vector<address>,
        num_premium_artists: u64,
        new_arrivals: NewArrivals,
        trending_songs: TrendingSongs,
    }

    struct SongLibrary has store{
        songs: Table<String, Genre>,
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
        let _genre_list = vector[utf8(b"Rock"), utf8(b"Pop"), utf8(b"HipHop"), utf8(b"Classical"), utf8(b"Jazz")];
        let init_song_table1 = table::new<String, Genre>();
        let init_song_table2 = table::new<String, Genre>(); 
        let i = 0;
        while(i < vector::length(&_genre_list)) {
            let genreLib1 = Genre {
                songs: table::new<u64, Song>(),
                num_songs: 0,
            };
            let genreLib2 = Genre {
                songs: table::new<u64, Song>(),
                num_songs: 0,
            };
            let genre = vector::borrow(&_genre_list, i);
            table::add(&mut init_song_table1, *genre, genreLib1);
            table::add(&mut init_song_table2, *genre, genreLib2);
            i = i + 1;
        };
        let song_store = SongStore {
            premium_songs: SongLibrary {
                songs: init_song_table1,
                num_genre: (vector::length(&_genre_list) as u8),
                genre_list: _genre_list,
            },

            free_songs: SongLibrary {
                songs: init_song_table2,
                num_genre: (vector::length(&_genre_list) as u8),
                genre_list: _genre_list,
            },

            premium_artists: vector::empty<address>(),
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

    public fun add_song_to_songStore(artist_acc: &signer, song: Song): u64 acquires SongStore {
        let artist_acc_addr = signer::address_of(artist_acc);
        // assert!(addr_on_chain_radio::user::check_acc_exists(artist_acc_addr), ACCOUNT_DOESNT_EXIST);
        let song_store = borrow_global_mut<SongStore>(@addr_res_acc_ocr);
        let songStoreID : u64;
        if(song.premium) {
            songStoreID = add_to_song_library(&mut song_store.premium_songs, copy song);
            if(!vector::contains(&song_store.premium_artists, &artist_acc_addr)) {
                song_store.num_premium_artists = song_store.num_premium_artists + 1;
                vector::push_back(&mut song_store.premium_artists, artist_acc_addr);
            }
        }
        else {
            songStoreID = add_to_song_library(&mut song_store.free_songs, copy song);
        };
        song.song_store_ID = songStoreID;
        //add to new arrivals
        add_to_new_arrivals(&mut song_store.new_arrivals, copy song);
        //add to trending songs
        add_to_trending_songs(&mut song_store.trending_songs, copy song);
        return songStoreID
    }

    fun add_to_song_library(song_library: &mut SongLibrary, song: Song): u64 {
        assert!(vector::contains(&song_library.genre_list, &song.genre), INVALID_GENRE);
        let song_table = &mut song_library.songs;
        let genreLib = table::borrow_mut(song_table, song.genre);
        let songID: u64 = genreLib.num_songs;
        song.song_store_ID = songID;
        table::upsert(&mut genreLib.songs, songID, song);
        genreLib.num_songs = genreLib.num_songs + 1;
        return songID
    }

    fun add_to_new_arrivals(new_arrivals: &mut NewArrivals, song: Song) {
        if(new_arrivals.num_songs == new_arrivals.max_songs) {
            table::remove(&mut new_arrivals.songs, new_arrivals.oldest_song);
            new_arrivals.num_songs = new_arrivals.num_songs - 1;
            let _oldest_song = new_arrivals.oldest_song+1;
            while(!table::contains(&new_arrivals.songs, _oldest_song)) {
                _oldest_song = _oldest_song + 1;
            };
            new_arrivals.oldest_song = _oldest_song;
        };
        table::upsert(&mut new_arrivals.songs, new_arrivals.num_songs, song);
        new_arrivals.num_songs = new_arrivals.num_songs + 1;
    }

    fun add_to_trending_songs(trending_songs: &mut TrendingSongs, song: Song) {
        if(trending_songs.num_songs == trending_songs.max_songs) {
            table::remove(&mut trending_songs.songs, trending_songs.least_trending);
            trending_songs.num_songs = trending_songs.num_songs - 1;
            let _least_trending = trending_songs.least_trending+1;
            while(!table::contains(&trending_songs.songs, _least_trending)) {
                _least_trending = _least_trending + 1;
            };
            trending_songs.least_trending = _least_trending;
        };
        table::upsert(&mut trending_songs.songs, trending_songs.num_songs, song);
        trending_songs.num_songs = trending_songs.num_songs + 1;
    }

    public fun remove_song_on_artist_req(artist: &signer, song: Song) acquires SongStore {
        let artist_addr = signer::address_of(artist);
        // assert!(addr_on_chain_radio::user::check_acc_exists(artist_addr), ACCOUNT_DOESNT_EXIST);
        assert!(song.artist_wallet_address == artist_addr, UNAUTHORIZED);
        remove_song(song);
    }

    public fun remove_reported_song(song: Song) acquires SongStore {
        let report_threshold = addr_res_acc_ocr::community::get_report_threshold();
        assert!(song.reports > report_threshold, SONG_DIDNT_CROSS_REPORT_THRESHOLD);
        remove_song(song);
    }

    fun remove_song(song: Song) acquires SongStore {
        let song_store = borrow_global_mut<SongStore>(@addr_res_acc_ocr);
        let song_library: &mut SongLibrary;
        if(song.premium) {
            song_library = &mut song_store.premium_songs;
        }
        else {
            song_library = &mut song_store.free_songs;
        };
        let genreLib = table::borrow_mut(&mut song_library.songs, song.genre);
        table::remove(&mut genreLib.songs, song.song_store_ID);
        genreLib.num_songs = genreLib.num_songs - 1;

        //removing from new arrivals
        let new_arrivals = &mut song_store.new_arrivals;
        let i = new_arrivals.oldest_song;
        while(i < new_arrivals.num_songs) {
            if(table::contains(&new_arrivals.songs, i)) {
                let _song = table::borrow(&mut new_arrivals.songs, i);
                if(_song.song_store_ID == song.song_store_ID) {
                    table::remove(&mut new_arrivals.songs, i);
                    new_arrivals.num_songs = new_arrivals.num_songs - 1;
                    if(i == new_arrivals.oldest_song) {
                        if(new_arrivals.num_songs == 0) {
                            new_arrivals.oldest_song = 0;
                        }
                        else {
                            let _oldest_song = i + 1;
                            while(!table::contains(&new_arrivals.songs, _oldest_song)) {
                                _oldest_song = _oldest_song + 1;
                            };
                            new_arrivals.oldest_song = _oldest_song;
                        }
                    };
                    break
                }
            };
            i = i + 1;
        };

        //removing from trending songs
        let trending_songs = &mut song_store.trending_songs;
        let i = trending_songs.least_trending;
        while(i < trending_songs.num_songs) {
            if(table::contains(&trending_songs.songs, i)) {
                let _song = table::borrow(&mut trending_songs.songs, i);
                if(_song.song_store_ID == song.song_store_ID) {
                    table::remove(&mut trending_songs.songs, i);
                    trending_songs.num_songs = trending_songs.num_songs - 1;
                    if(i == trending_songs.least_trending) {
                        if(trending_songs.num_songs == 0) {
                            trending_songs.least_trending = 0;
                        }
                        else {
                            let _least_trending = i + 1;
                            while(!table::contains(&trending_songs.songs, _least_trending)) {
                                _least_trending = _least_trending + 1;
                            };
                            trending_songs.least_trending = _least_trending;
                        }
                    };
                    break
                }
            };
            i = i + 1;
        };
    }

    #[view]
    public fun get_premium_artists_list(): vector<address> acquires SongStore {
        let song_store = borrow_global<SongStore>(@addr_res_acc_ocr);
        return song_store.premium_artists
    }

    #[test(resource_acc = @0x123)]
    public entry fun test_init_songStore(resource_acc: &signer) {
        let resource_acc_addr = signer::address_of(resource_acc);
        account::create_account_for_test(resource_acc_addr);
        assert!(!exists<SongStore>(resource_acc_addr), 1);
        init_module(resource_acc);
        assert!(exists<SongStore>(resource_acc_addr), 2);
    }

    #[test(store_acc = @addr_res_acc_ocr)]
    public entry fun test_add_and_remove_song_to_songStore(store_acc: &signer) acquires SongStore {
        let store_acc_addr = signer::address_of(store_acc);
        account::create_account_for_test(store_acc_addr);
        init_module(store_acc);
        assert!(exists<SongStore>(store_acc_addr), 1);

        let artist1_addr = @0x6879;
        let artist1 = account::create_account_for_test(artist1_addr);
        let song1 = Song {
            song_store_ID: 0,
            my_songs_ID: 0,
            artist_wallet_address: artist1_addr,
            title: utf8(b"song1"),
            ipfs_hash: utf8(b"ipfs_hash1"),
            total_tips: 0,
            duration: 90,
            premium: false,
            genre: utf8(b"Rock"),
            reports: 0,
        };
        let artist2_addr = @0x6878;
        let artist2 = account::create_account_for_test(artist2_addr);
        let song2 = Song {
            song_store_ID: 0,
            my_songs_ID: 0,
            artist_wallet_address: artist2_addr,
            title: utf8(b"song2"),
            ipfs_hash: utf8(b"ipfs_hash2"),
            total_tips: 0,
            duration: 78,
            premium: false,
            genre: utf8(b"Rock"),
            reports: 0,
        };

        add_song_to_songStore(&artist1, song1);
        assert!(table::borrow(&table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).songs, 0).title == utf8(b"song1"), 2);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).new_arrivals.songs, 0).title == utf8(b"song1"), 9);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).trending_songs.songs, 0).title == utf8(b"song1"), 10);

        add_song_to_songStore(&artist2, song2);
        assert!(table::borrow(&table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).songs, 1).title == utf8(b"song2"), 3);
        assert!(table::borrow(&table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).songs, 1).song_store_ID == 1, 4);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 2, 5);
        
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).new_arrivals.songs, 1).title == utf8(b"song2"), 11);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).trending_songs.songs, 1).title == utf8(b"song2"), 12);
        assert!(borrow_global<SongStore>(store_acc_addr).new_arrivals.num_songs == 2, 21);
        assert!(borrow_global<SongStore>(store_acc_addr).trending_songs.num_songs == 2, 22);
       

        remove_song_on_artist_req(&artist1, song1);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 1, 5);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).new_arrivals.songs, 1).title == utf8(b"song2"), 13);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).trending_songs.songs, 1).title == utf8(b"song2"), 14);
        assert!(borrow_global<SongStore>(store_acc_addr).new_arrivals.num_songs == 1, 23);
        assert!(borrow_global<SongStore>(store_acc_addr).trending_songs.num_songs == 1, 24);
    }

    #[test(store_acc = @addr_res_acc_ocr)]
    #[expected_failure(abort_code = UNAUTHORIZED)]
    public entry fun test_invalid_song_removal(store_acc: &signer) acquires SongStore {
        let store_acc_addr = signer::address_of(store_acc);
        account::create_account_for_test(store_acc_addr);
        init_module(store_acc);
        assert!(exists<SongStore>(store_acc_addr), 1);

        let artist1_addr = @0x6879;
        let artist1 = account::create_account_for_test(artist1_addr);
        let song1 = Song {
            song_store_ID: 0,
            my_songs_ID: 0,
            artist_wallet_address: artist1_addr,
            title: utf8(b"song1"),
            ipfs_hash: utf8(b"ipfs_hash1"),
            total_tips: 0,
            duration: 90,
            premium: false,
            genre: utf8(b"Rock"),
            reports: 0,
        };

        add_song_to_songStore(&artist1, song1);
        assert!(table::borrow(&table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).songs, 0).title == utf8(b"song1"), 2);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 1, 5);

        let artist2_addr = @0x6878;
        let artist2 = account::create_account_for_test(artist2_addr);
        remove_song_on_artist_req(&artist2, song1);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 1, 5);
    }
        
}