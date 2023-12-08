module addr_on_chain_radio::songStore {

    friend addr_on_chain_radio::song;

    use aptos_std::table::{Self, Table};
    use std::vector;
    use std::signer;
    use std::string::{String, utf8};
    use 0x1::coin;
    use 0x1::aptos_coin::AptosCoin; 
    use 0x1::aptos_account;

    #[test_only]
    use std::account;
    #[test_only]
    use std::aptos_coin;

    const ACCOUNT_DOESNT_EXIST: u64 = 300;
    const INVALID_GENRE: u64 = 301;
    const UNAUTHORIZED: u64 = 302;
    const SONG_DIDNT_CROSS_REPORT_THRESHOLD: u64 = 303;
    const ALREADY_REPORTED: u64 = 304;
    const INSUFFICIENT_FUNDS: u64 = 305;

    // Add crew info table
    struct Song has store, drop, copy {
        song_store_ID: u64,
        artist_store_ID: u64,
        artist_wallet_address: address,
        title: String,
        ipfs_hash: String,
        ipfs_hash_cover_img: String,
        total_tips: u64,
        premium: bool,
        genre: String,
        vocalist: String,
        lyricist: String,
        musician: String,
        audio_engineer: String,
        reports: u64,
        reporters: vector<address>,
    }

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

    public(friend) fun add_song_to_songStore(artist_acc: &signer, song: Song): Song acquires SongStore {
        let artist_acc_addr = signer::address_of(artist_acc);
        // assert!(addr_on_chain_radio::user::check_acc_exists(artist_acc_addr), ACCOUNT_DOESNT_EXIST);
        let song_store = borrow_global_mut<SongStore>(@addr_on_chain_radio);
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
        
        add_to_new_arrivals(&mut song_store.new_arrivals, copy song);
        return song
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

    fun update_least_trending(trending_songs: &mut TrendingSongs) {
        let _least_trending = trending_songs.least_trending;
        let _least_trending_total_tips = table::borrow(&trending_songs.songs, _least_trending).total_tips;
        let i = 0;
        let j = 0;
        while(j < trending_songs.num_songs) {
            if(table::contains(&trending_songs.songs, i)) {
                let _song = table::borrow(&trending_songs.songs, i);
                if(_song.total_tips < _least_trending_total_tips) {
                    _least_trending = i;
                    _least_trending_total_tips = _song.total_tips;
                };
                j = j + 1;
            };
            i = i + 1;
        };
        trending_songs.least_trending = _least_trending;
    }

    public(friend) fun add_to_trending_songs(trending_songs: &mut TrendingSongs, song: Song) {
        let i = 0;
        let j = 0;
        while(j < trending_songs.num_songs){
            if(table::contains(&trending_songs.songs, i)) {
                let _song = table::borrow_mut(&mut trending_songs.songs, i);
                if(_song.song_store_ID == song.song_store_ID) {
                    _song.total_tips = song.total_tips;
                    if(i == trending_songs.least_trending) {
                        update_least_trending(trending_songs);
                    };
                    return
                };
                j = j + 1;
            };
            i = i + 1;
        };
        if(trending_songs.num_songs < trending_songs.max_songs) {
            table::add(&mut trending_songs.songs, trending_songs.num_songs, song);
            trending_songs.num_songs = trending_songs.num_songs + 1;
            update_least_trending(trending_songs);
        }else if(song.total_tips > table::borrow(&trending_songs.songs, trending_songs.least_trending).total_tips) {
            table::remove(&mut trending_songs.songs, trending_songs.least_trending);
            table::add(&mut trending_songs.songs, trending_songs.num_songs, song);
            update_least_trending(trending_songs);
        }
    }
    

    public(friend) fun report_song(reporter: &signer, song: &mut Song) {
        let reporter_addr = signer::address_of(reporter);
        assert!(!vector::contains(&song.reporters, &reporter_addr), ALREADY_REPORTED);
        song.reports = song.reports + 1;
        vector::push_back(&mut song.reporters, reporter_addr);
    }

    public(friend) fun remove_song(song: Song) acquires SongStore {
        let song_store = borrow_global_mut<SongStore>(@addr_on_chain_radio);
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
        let j = i;
        while(j < new_arrivals.num_songs) {
            if(table::contains(&new_arrivals.songs, i)) {
                let _song = table::borrow(&new_arrivals.songs, i);
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
                };
                j = j + 1;
            };
            i = i + 1;
        };

        //removing from trending songs
        let trending_songs = &mut song_store.trending_songs;
        let i = trending_songs.least_trending;
        let j = i;
        while(j < trending_songs.num_songs) {
            if(table::contains(&trending_songs.songs, i)) {
                let _song = table::borrow(&trending_songs.songs, i);
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
                };
                j = j + 1;
            };
            i = i + 1;
        };
    }

    public fun tip_song(tipper: &signer, song_store_ID: u64, genre: String, premium: bool, tip_amount: u64) acquires SongStore {
        let song_store = borrow_global_mut<SongStore>(@addr_on_chain_radio);
        let song_library: &mut SongLibrary;
        if(premium) {
            song_library = &mut song_store.premium_songs;
        }
        else {
            song_library = &mut song_store.free_songs;
        };
        let genreLib = table::borrow_mut(&mut song_library.songs, genre);
        let song = table::borrow_mut(&mut genreLib.songs, song_store_ID);
        assert!(coin::balance<AptosCoin>(signer::address_of(tipper)) >= tip_amount, INSUFFICIENT_FUNDS);
        let artist_cut = (addr_on_chain_radio::community::get_artist_gen_cut() as u64);
        // let artist_cut = 80;
        aptos_account::transfer(tipper, song.artist_wallet_address, (tip_amount * artist_cut) / 100);
        aptos_account::transfer(tipper, @admin, tip_amount - ((tip_amount * artist_cut) / 100));
        song.total_tips = song.total_tips + tip_amount;
        add_to_trending_songs(&mut song_store.trending_songs, *song);
    }

    public fun instantiate_song(
        artist_acc_addr: address,
        artist_store_ID: u64,
        title: String,
        ipfs_hash: String,
        ipfs_hash_cover_img: String,
        premium: bool,
        genre: String,
        vocalist: String,
        lyricist: String,
        musician: String,
        audio_engineer: String,
    ): Song {
        let song = Song {
            song_store_ID: 0,
            artist_store_ID: artist_store_ID,
            artist_wallet_address: artist_acc_addr,
            title: title,
            ipfs_hash: ipfs_hash,
            ipfs_hash_cover_img: ipfs_hash_cover_img,
            total_tips: 0,
            premium: premium,
            genre: genre,
            reports: 0,
            reporters: vector::empty<address>(),
            vocalist: vocalist,
            lyricist: lyricist,
            musician: musician,
            audio_engineer: audio_engineer,
        };
        return song
    }

    public fun get_song_title(song: &Song): String {
        return song.title
    }

    public fun get_song_artist_addr(song: &Song): address {
        return song.artist_wallet_address
    }

    public fun get_song_reports(song: &Song): u64 {
        return song.reports
    }

    
    #[view]
    public fun get_premium_artists_list(): vector<address> acquires SongStore {
        let song_store = borrow_global<SongStore>(@addr_on_chain_radio);
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

    #[test(store_acc = @addr_on_chain_radio)]
    public entry fun test_add_and_remove_song_to_songStore(store_acc: &signer) acquires SongStore {
        let store_acc_addr = signer::address_of(store_acc);
        account::create_account_for_test(store_acc_addr);
        init_module(store_acc);
        assert!(exists<SongStore>(store_acc_addr), 1);

        let artist1_addr = @0x6879;
        let artist1 = account::create_account_for_test(artist1_addr);
        let song1 = instantiate_song(artist1_addr, 0, utf8(b"song1"), utf8(b"ipfs_hash1"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Rock"), utf8(b"vocalist1"), utf8(b"lyricist1"), utf8(b"musician1"), utf8(b"audio_engineer1"));
        let artist2_addr = @0x6878;
        let artist2 = account::create_account_for_test(artist2_addr);
        let song2 = instantiate_song(artist2_addr, 0, utf8(b"song2"), utf8(b"ipfs_hash2"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Rock"), utf8(b"vocalist2"), utf8(b"lyricist2"), utf8(b"musician2"), utf8(b"audio_engineer2"));

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
       

        remove_song(song1);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 1, 5);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).new_arrivals.songs, 1).title == utf8(b"song2"), 13);
        assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).trending_songs.songs, 1).title == utf8(b"song2"), 14);
        assert!(borrow_global<SongStore>(store_acc_addr).new_arrivals.num_songs == 1, 23);
        assert!(borrow_global<SongStore>(store_acc_addr).trending_songs.num_songs == 1, 24);
    }

    // #[test(store_acc = @addr_on_chain_radio)]
    // #[expected_failure(abort_code = UNAUTHORIZED)]
    // public entry fun test_invalid_song_removal(store_acc: &signer) acquires SongStore {
    //     let store_acc_addr = signer::address_of(store_acc);
    //     account::create_account_for_test(store_acc_addr);
    //     init_module(store_acc);
    //     assert!(exists<SongStore>(store_acc_addr), 1);

    //     let artist1_addr = @0x6879;
    //     let artist1 = account::create_account_for_test(artist1_addr);
    //     let song1 = instantiate_song(artist1_addr, 0, utf8(b"song1"), utf8(b"ipfs_hash1"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Rock"), utf8(b"vocalist1"), utf8(b"lyricist1"), utf8(b"musician1"), utf8(b"audio_engineer1"));

    //     add_song_to_songStore(&artist1, song1);
    //     assert!(table::borrow(&table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).songs, 0).title == utf8(b"song1"), 2);
    //     assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 1, 5);

    //     let artist2_addr = @0x6878;
    //     let artist2 = account::create_account_for_test(artist2_addr);
    //     remove_song_on_artist_req(&artist2, song1);
    //     assert!(table::borrow(&borrow_global<SongStore>(store_acc_addr).free_songs.songs, utf8(b"Rock")).num_songs == 1, 5);
    // }

    #[test(store_acc = @addr_on_chain_radio, aptos_framework = @0x1)]
    public entry fun test_tipping(store_acc: &signer, aptos_framework: &signer) acquires SongStore {
        let (_burn_cap, _mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);
        let aptos_framework_address = @0x1;
        account::create_account_for_test(aptos_framework_address);
        account::create_account_for_test(signer::address_of(store_acc));
        init_module(store_acc);
        
        let tipper = account::create_account_for_test(@0x6879);
        let artist = account::create_account_for_test(@0x6878);
        let admin = account::create_account_for_test(@admin);

        coin::register<AptosCoin>(&tipper);
        coin::register<AptosCoin>(&artist);
        coin::register<AptosCoin>(&admin);

        aptos_coin::mint(aptos_framework, @0x6879, 200);
        aptos_coin::mint(aptos_framework, @0x6878, 200);
        aptos_coin::mint(aptos_framework, @admin, 200);

        let song = instantiate_song(signer::address_of(&artist), 0, utf8(b"song1"), utf8(b"ipfs_hash1"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Rock"), utf8(b"vocalist1"), utf8(b"lyricist1"), utf8(b"musician1"), utf8(b"audio_engineer1"));
        add_song_to_songStore(&artist, song);
        tip_song(&tipper, 0, utf8(b"Rock"), false, 100);
        assert!(coin::balance<AptosCoin>(signer::address_of(&artist)) == 280, 1);
        assert!(coin::balance<AptosCoin>(signer::address_of(&admin)) == 220, 2);
        assert!(coin::balance<AptosCoin>(signer::address_of(&tipper)) == 100, 3);
    
        assert!(table::borrow(&table::borrow(&borrow_global<SongStore>(signer::address_of(store_acc)).free_songs.songs, utf8(b"Rock")).songs, 0).total_tips == 100, 4);
        assert!(table::borrow(&borrow_global<SongStore>(signer::address_of(store_acc)).trending_songs.songs, 0).total_tips == 100, 5);
        assert!(table::borrow(&borrow_global<SongStore>(signer::address_of(store_acc)).trending_songs.songs, 0).title == utf8(b"song1"), 6);
        
        tip_song(&tipper, 0, utf8(b"Rock"), false, 100);
        assert!(table::borrow(&borrow_global<SongStore>(signer::address_of(store_acc)).trending_songs.songs, 0).total_tips == 200, 7);
        
        coin::destroy_burn_cap(_burn_cap);
        coin::destroy_mint_cap(_mint_cap);
    }
        
}