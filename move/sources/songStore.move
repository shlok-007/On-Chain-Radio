module addr_songStore::songStore {

    use aptos_std::table::{Self, Table};
    // use addr_on_chain_radio::song::Song;
    use std::vector;
    // use std::resource_account;
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

    struct SongLibrary has store {
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
        // let _genre_list = vector["Rock", "Pop", "Hip Hop", "Classical", "Jazz"];
        let _genre_list = vector[utf8(b"Rock"), utf8(b"Pop"), utf8(b"HipHop"), utf8(b"Classical"), utf8(b"Jazz")];
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
        assert!(addr_on_chain_radio::user::check_acc_exists(artist_acc_addr), ACCOUNT_DOESNT_EXIST);
        let song_store = borrow_global_mut<SongStore>(@addr_songStore);
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
        let genreLib = table::borrow_mut(&mut song_library.songs, song.genre);
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
        assert!(addr_on_chain_radio::user::check_acc_exists(artist_addr), ACCOUNT_DOESNT_EXIST);
        assert!(song.artist_wallet_address == artist_addr, UNAUTHORIZED);
        remove_song(song);
    }

    public fun remove_reported_song(song: Song) acquires SongStore {
        let report_threshold = addr_community::community::get_report_threshold();
        assert!(song.reports > report_threshold, SONG_DIDNT_CROSS_REPORT_THRESHOLD);
        remove_song(song);
    }

    fun remove_song(song: Song) acquires SongStore {
        let song_store = borrow_global_mut<SongStore>(@addr_songStore);
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
                    break
                }
            };
            i = i + 1;
        };
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