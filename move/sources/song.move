 module addr_on_chain_radio::song{
   use std::string::{String, utf8};
   // use addr_res_acc_ocr::songStore::Song;
    //use addr_on_chain_radio::user::Bio;
    //use addr_on_chain_radio::user::Account;
    use std::signer;
    use aptos_std::table::{Self, Table};
    //use std::vector;

    //use 0x1::aptos_account;

     #[test_only]
    use std::account;

    const NO_ARTIST: u64 = 0;
    const ALREADY_REGISTERED: u64 = 1;

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

    struct Artist has key, store {
        artist_address: address,
        name: String,
        //bio: Bio,
        registered: bool,
        songs: Table<u64, Song>,
    }

    public entry fun register_artist(account: &signer, _name: String,_registered:bool) {
        let artist_address = signer::address_of(account);
        //let is_user_registered: bool = exists<Account>(artist_address);
        //assert!(is_user_registered, 200);
        let new_artist = Artist {
            artist_address: artist_address,
            name: _name,
            //bio: Bio {
            //    location: utf8(b""),
            //    profession: utf8(b""),
            //    about: utf8(b"")
            // },
            registered: _registered,
            songs: table::new()
        };
        move_to(account, new_artist);
    }
    // to interact with SongStore
    public entry fun upload_song_artist(artist_account: &signer, song: Song) acquires Artist {
        let artist_address = signer::address_of(artist_account);
        assert!(exists<Artist>(artist_address), NO_ARTIST);
        let  artist = borrow_global_mut<Artist>(artist_address);
        let _songID =song.song_store_ID + 1;
        table::upsert(&mut artist.songs, _songID, song);
        _songID=_songID+1;
    }

    #[test_only]
    use std::string;
    #[test_only]
    use std::debug::print;
    #[test_only]
    use std::timestamp;
    #[test_only]
    use aptos_framework::account;

    #[test(artist_acc = @0x456)]
    public entry fun test_artist_store(artist_acc: &signer) acquires Artist {
        timestamp::set_time_has_started_for_testing(artist_acc);
        timestamp::update_global_time_for_test_secs(10);
        print(&utf8(b"Before time: "));
        let _before_time = timestamp::now_seconds();
        print(&_before_time);
        let artist_address = signer::address_of(artist_acc);

        //Register an artist
        register_artist(artist_acc, string::utf8(b"Artist1"), false);
        assert!(exists<Artist>(artist_address), 100);
        let artist = borrow_global<Artist>(artist_address);
        assert!(artist.registered, 101);  
    }
    // will need acquiring songstore when include
    #[test(store_acc_artist = @0x456)]
    public entry fun test_add_artist_song(store_acc_artist:&signer) {
    let artist_address = signer::address_of(store_acc_artist);
    assert!(exists<Artist>(artist_address), 100);

    let song_name = string::utf8(b"MySong");
    let premium = false;
    let ipfs_hash = string::utf8(b"ipfs_hash");
    let crew = vector[string::utf8(b"Member1"), string::utf8(b"Member2")];
    let song = Song {
        song_store_ID: 0,
        my_songs_ID: 0,
        artist_wallet_address: artist_address,
        title: song_name,
        ipfs_hash: ipfs_hash,
        total_tips: 0,
        duration: 50,
        premium: premium,
        genre: utf8(b""),
        reports: 0,
        crew_mem: crew
    };

    upload_song_artist(store_acc_artist,song);
    //need the genre table from songstore
    assert!(table::contains(&artist.songs, 0), 200);
     }

}



