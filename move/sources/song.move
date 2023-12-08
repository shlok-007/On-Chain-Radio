 module addr_on_chain_radio::song{

    use std::string::String;
    use addr_on_chain_radio::songStore;
    use addr_on_chain_radio::songStore::Song;
    use aptos_std::table::{Self, Table};
    use addr_on_chain_radio::user::check_acc_exists;
    use std::signer;

    const NO_ARTIST: u64 = 200;
    const ALREADY_REGISTERED: u64 = 201;
    const NO_ACCOUNT: u64 = 202;
    const UNAUTHORIZED: u64 = 203;
    const SONG_DIDNT_CROSS_REPORT_THRESHOLD: u64 = 204;

    struct ArtistStore has key, store {
        artist_address: address,
        songs: Table<u64, Song>,
        num_songs: u64
    }

    public entry fun register_artist(account: &signer) {
        let artist_address = signer::address_of(account);
        assert!(check_acc_exists(artist_address), NO_ACCOUNT);
        assert!(!exists<ArtistStore>(artist_address), ALREADY_REGISTERED);
        let new_artist_store = ArtistStore {
            artist_address: artist_address,
            songs: table::new<u64, Song>(),
            num_songs: 0
        };
        move_to(account, new_artist_store);
    }

    public entry fun upload_song(
        artist_account: &signer,
        title: String,
        ipfs_hash: String,
        ipfs_hash_cover_img: String,
        premium: bool,
        genre: String,
        vocalist: String,
        lyricist: String,
        musician: String,
        audio_engineer: String
        ) acquires ArtistStore {

        let artist_address = signer::address_of(artist_account);
        assert!(check_acc_exists(artist_address), NO_ACCOUNT);
        if(!exists<ArtistStore>(artist_address)){
            register_artist(artist_account);
        };
        let artist_store = borrow_global_mut<ArtistStore>(artist_address);
        let artist_store_ID = artist_store.num_songs;
        let song = songStore::instantiate_song(artist_address, artist_store_ID, title, ipfs_hash, ipfs_hash_cover_img, premium, genre, vocalist, lyricist, musician, audio_engineer);
        
        song = songStore::add_song_to_songStore(artist_account, song);

        table::upsert(&mut artist_store.songs, artist_store_ID, song);
        artist_store.num_songs = artist_store.num_songs + 1;
    }

    fun remove_song(artist_store_ID: u64, artist_songs: &mut Table<u64, Song>) {
        table::remove(artist_songs, artist_store_ID);
    }

    public fun remove_song_by_artist(artist_account: &signer, artist_store_ID: u64) acquires ArtistStore {
        let artist_address = signer::address_of(artist_account);
        assert!(check_acc_exists(artist_address), NO_ACCOUNT);
        let artist_store = borrow_global_mut<ArtistStore>(artist_address);
        let song = *table::borrow(&artist_store.songs, artist_store_ID);
        assert!(artist_address == songStore::get_song_artist_addr(&song), UNAUTHORIZED);
        remove_song(artist_store_ID, &mut artist_store.songs);

        songStore::remove_song(copy song);

        artist_store.num_songs = artist_store.num_songs - 1;
    }

    fun remove_reported_song(artist_addr: address, artist_store_ID: u64) acquires ArtistStore {
        let artist_store = borrow_global_mut<ArtistStore>(artist_addr);
        remove_song(artist_store_ID, &mut artist_store.songs);
        let song = *table::borrow(&artist_store.songs, artist_store_ID);
        songStore::remove_song(copy song);
        artist_store.num_songs = artist_store.num_songs - 1;
    }

    public fun report_song(reporter: &signer, artist_addr: address, artist_store_ID: u64) acquires ArtistStore {
        let reporter_address = signer::address_of(reporter);
        assert!(check_acc_exists(reporter_address), NO_ACCOUNT);
        let artist_store = borrow_global_mut<ArtistStore>(artist_addr);
        let song = table::borrow_mut(&mut artist_store.songs, artist_store_ID);
        songStore::report_song(reporter, song);
        if(songStore::get_song_reports(freeze(song)) > addr_on_chain_radio::community::get_report_threshold()){
            remove_reported_song(artist_addr, artist_store_ID);
        }
    }


    #[test_only]
    use std::string::utf8;
    #[test_only]
    use std::debug::print;
    #[test_only]
    use aptos_framework::account;

    #[test(artist_acc = @0x456)]
    public entry fun test_artist_init(artist_acc: &signer) {
        let artist_acc_addr = signer::address_of(artist_acc);
        account::create_account_for_test(artist_acc_addr);
        assert!(!check_acc_exists(artist_acc_addr), 1);
        addr_on_chain_radio::user::create_account(artist_acc, utf8(b"John Doe"), utf8(b"john@gmail.com"));
        assert!(check_acc_exists(artist_acc_addr), 2);
        assert!(!exists<ArtistStore>(artist_acc_addr), 3);
        register_artist(artist_acc);
        assert!(exists<ArtistStore>(artist_acc_addr), 4);
    }

    #[test(artist_acc = @0x456, store_acc = @addr_on_chain_radio)]
    public entry fun test_upload_song(artist_acc: &signer, store_acc: &signer) acquires ArtistStore {
        let artist_acc_addr = signer::address_of(artist_acc);
        account::create_account_for_test(artist_acc_addr);
        account::create_account_for_test(signer::address_of(store_acc));
        addr_on_chain_radio::user::create_account(artist_acc, utf8(b"John Doe"), utf8(b"john@gmail.com"));
        // addr_on_chain_radio::songStore::init_module(store_acc);
        upload_song(artist_acc, utf8(b"Song1"), utf8(b"ipfs_hash1"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Pop"), utf8(b"vocalist1"), utf8(b"lyricist1"), utf8(b"musician1"), utf8(b"audio_engineer1"));
        upload_song(artist_acc, utf8(b"Song2"), utf8(b"ipfs_hash2"), utf8(b"ipfs_hash_cvr_img"), true, utf8(b"Rock"), utf8(b"vocalist2"), utf8(b"lyricist2"), utf8(b"musician2"), utf8(b"audio_engineer2"));
        assert!(borrow_global<ArtistStore>(artist_acc_addr).num_songs == 2, 1);
        assert!(songStore::get_song_title(table::borrow(&borrow_global<ArtistStore>(artist_acc_addr).songs , 0)) == utf8(b"Song1"), 2);
        print(&borrow_global<ArtistStore>(artist_acc_addr).songs);
    }

    #[test(artist_acc = @0x456)]
    public entry fun test_remove_song(artist_acc: &signer) acquires ArtistStore {
        let artist_acc_addr = signer::address_of(artist_acc);
        account::create_account_for_test(artist_acc_addr);
        addr_on_chain_radio::user::create_account(artist_acc, utf8(b"John Doe"), utf8(b"john@gmail.com"));
        upload_song(artist_acc, utf8(b"Song1"), utf8(b"ipfs_hash1"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Pop"), utf8(b"vocalist1"), utf8(b"lyricist1"), utf8(b"musician1"), utf8(b"audio_engineer1"));
        upload_song(artist_acc, utf8(b"Song2"), utf8(b"ipfs_hash2"), utf8(b"ipfs_hash_cvr_img"), true, utf8(b"Rock"), utf8(b"vocalist2"), utf8(b"lyricist2"), utf8(b"musician2"), utf8(b"audio_engineer2"));
        // let artist_store = borrow_global_mut<ArtistStore>(artist_acc_addr);
        assert!(borrow_global<ArtistStore>(artist_acc_addr).num_songs == 2, 1);
        remove_song_by_artist(artist_acc, 0);
        assert!(borrow_global<ArtistStore>(artist_acc_addr).num_songs == 1, 2);
    }

    #[test(artist_acc = @0x456)]
    public entry fun test_report_song(artist_acc: &signer) acquires ArtistStore {
        let artist_acc_addr = signer::address_of(artist_acc);
        account::create_account_for_test(artist_acc_addr);
        addr_on_chain_radio::user::create_account(artist_acc, utf8(b"John Doe"), utf8(b"john@gmail.com"));
        upload_song(artist_acc, utf8(b"Song1"), utf8(b"ipfs_hash1"), utf8(b"ipfs_hash_cvr_img"), false, utf8(b"Pop"), utf8(b"vocalist1"), utf8(b"lyricist1"), utf8(b"musician1"), utf8(b"audio_engineer1"));
        upload_song(artist_acc, utf8(b"Song2"), utf8(b"ipfs_hash2"), utf8(b"ipfs_hash_cvr_img"), true, utf8(b"Rock"), utf8(b"vocalist2"), utf8(b"lyricist2"), utf8(b"musician2"), utf8(b"audio_engineer2"));

        let reporter = account::create_account_for_test(@0x123);
        addr_on_chain_radio::user::create_account(&reporter, utf8(b"Sunny"), utf8(b"sunny@gmail.com"));
        report_song(&reporter, artist_acc_addr, 0);
        assert!(songStore::get_song_reports(table::borrow(&borrow_global<ArtistStore>(artist_acc_addr).songs , 0)) == 1, 1);
    }
        
}



