module addr_on_chain_radio::song{
import 0x1::std::address;
import 0x1::std::string::String;
import 0x1::std::vec::Vec;
import 0x1::aptos_std::event;
import 0x1::aptos_crypto::Crypto;
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
resource struct Song {
    id: u64,
    artist: address,
    title: vector<u8>,
    content: vector<u8>,
    tip_pool: u64,
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
resource struct UserProfile {
    user: address,
    listened_tracks: Vec<u64>,
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
resource struct Artist {
    address: address,
    authorized: bool,
}
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
resource struct Tip {
    sender: address,
    amount: u64,
}
<<<<<<< Updated upstream

//event Tipped(artist: address, user: address, amount: u64);

=======
//event Tipped(artist: address, user: address, amount: u64);
>>>>>>> Stashed changes
public struct TipDistributionEvent {
    sender: address,
    artist: address,
    amount: u64,
}
<<<<<<< Updated upstream

//sets
//public mutable set<address> AuthorizedUsers;
//public mutable set<address> AuthorizedArtists;

public fun upload_Song(title: vector<u8>, content: vector<u8>) {
    let artist: address = signer();
    let id: u64 = AptosCrypto::random_u64(); 

=======
//sets
//public mutable set<address> AuthorizedUsers;
//public mutable set<address> AuthorizedArtists;
public fun upload_Song(title: vector<u8>, content: vector<u8>) {
    let artist: address = signer();
    let id: u64 = AptosCrypto::random_u64(); 
>>>>>>> Stashed changes
    let song = Song {
        id: id,
        artist: artist,
        title: title,
        content: content,
        tip_pool:0,
    };
<<<<<<< Updated upstream

    move_to<Song>(artist,song);
}

public fun listen_Song(user: &signer, track_id: u64) {
        let user_address = signer::address_of(user);

        // song from stor
        let track = move_from<Song>(move(id));

        // Add to user listen tracks
        let mut user_profile = move_from_opt<UserProfile>(move(user_address));

=======
    move_to<Song>(artist,song);
}
public fun listen_Song(user: &signer, track_id: u64) {
        let user_address = signer::address_of(user);
        // song from stor
        let track = move_from<Song>(move(id));
        // Add to user listen tracks
        let mut user_profile = move_from_opt<UserProfile>(move(user_address));
>>>>>>> Stashed changes
        if let Some(profile) = user_profile {
            profile.listened_tracks.push(id);
            move_to<UserProfile>(move(user_address), move(profile));
        } else {
            // If !user profile, create a new
            let new_profile = UserProfile {
                user: user_address,
                listened_tracks: vec![id],
            };
            move_to<UserProfile>(move(user_address), move(new_profile));
        }
    }
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    public fun authorizeArtist(artist: address, authorized: bool) {
        let artistResource = &mut Artist{address: artist, authorized: authorized};
        move_to_sender(artistResource);
    }
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    public fun tip(sender: address, composer: address, singer: address, band: address, amount: u64) {
        let composerResource = borrow_global_mut<Artist>(composer);
        let singerResource = borrow_global_mut<Artist>(singer);
        let bandResource = borrow_global_mut<Artist>(band);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        if !composerResource.authorized {
            abort("Composer is not authorized");
        }
        if !singerResource.authorized {
            abort("Singer is not authorized");
        }
        if !bandResource.authorized {
            abort("Band is not authorized");
        }
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    let total_amount = Aptos::coin_balance_of<CoinType>(sender);
    assert(total_amount >= amount, 0x0);
    
    //(25:40:35 distri)
    let composer_share = (amount * 25) / 100;
    let singer_share = (amount * 40) / 100;
    let band_share = (amount * 35) / 100;
<<<<<<< Updated upstream

    //total to be amt
    assert(composer_share + singer_share + band_share == amount, 0x1);

    Aptos::coin_transfer<CoinType>(sender, composer, composer_share);
    Aptos::coin_transfer<CoinType>(sender, singer, singer_share);
    Aptos::coin_transfer<CoinType>(sender, band, band_share);

=======
    //total to be amt
    assert(composer_share + singer_share + band_share == amount, 0x1);
    Aptos::coin_transfer<CoinType>(sender, composer, composer_share);
    Aptos::coin_transfer<CoinType>(sender, singer, singer_share);
    Aptos::coin_transfer<CoinType>(sender, band, band_share);
>>>>>>> Stashed changes
    // Event emitter
    let event = TipDistributionEvent {
        sender: sender,
        composer: composer,
        singer: singer,
        band: band,
        amount: amount,
        composer_share: composer_share,
        singer_share: singer_share,
        band_share: band_share,
    };
    event::emit(event);
}
<<<<<<< Updated upstream
}
=======

public fun test_upload_Song() {
    let title: vector<u8> = "My Song Title".encode_utf8().unwrap();
    let content: vector<u8> = "Song content..".encode_utf8().unwrap();

    // Get the artist's address for testing
    let artist_address = signer();

    upload_Song(title, content);

    // Retrieve the uploaded song from storage
    let uploaded_song = move_from<Song>(artist_address);
    
    //check the state to ensure the song is uploaded correctly
    assert(uploaded_song.is_some(), 0x0);
    
    // Unwrap song
    let song = uploaded_song.unwrap();

    // Assert specific properties of the uploaded song
    assert(song.id > 0, 0x1); // Ensure a valid ID
    assert(song.artist == artist_address, 0x2); // Ensure correct artist
    assert(song.title == title, 0x3); // Ensure correct title
    assert(song.content == content, 0x4);
    assert(song.tip_pool == 0, 0x5); 
}

public fun test_listen_Song() {
    // Assuming you have a user signer for testing
    let user_signer = <some_test_signer>;

    // Assuming you have a track ID for testing
    let track_id: u64 = <some_track_id>;

    // Call the listen_Song function
    listen_Song(&user_signer, track_id);

    // Retrieve the user's address
    let user_address = signer::address_of(&user_signer);

    // Retrieve the user's profile from storage
    let user_profile = move_from_opt<UserProfile>(move(user_address));

    // Assert that the user's profile exists
    assert(user_profile.is_some(), 0x0);

    // Unwrap the user's profile from the Option type
    let profile = user_profile.unwrap();

    // Assert that the track ID is added to the user's listened tracks
    assert(profile.listened_tracks.contains(&track_id), 0x1);
}

public fun test_authorizeArtist() {
    // Assuming you have an artist's address for testing
    let artist_address = <some_test_address>;

    // Call the authorizeArtist function
    authorizeArtist(artist_address, true);

    // Retrieve the Artist resource from storage
    let artist_resource = borrow_global_mut<Artist>(artist_address);

    // Assert that the artist resource exists
    assert(artist_resource.is_some(), 0x0);

    // Unwrap the artist resource from the Option type
    let artist = artist_resource.unwrap();

    // Assert that the artist is authorized
    assert(artist.authorized, 0x1);
}

public fun test_tip() {
    // Assuming you have sender and artist addresses for testing
    let sender = <some_sender_address>;
    let composer = <some_composer_address>;
    let singer = <some_singer_address>;
    let band = <some_band_address>;

    // Call the tip function
    tip(sender, composer, singer, band, <some_amount>);

    // Retrieve the balances of the artists after the tip
    let composer_balance = Aptos::coin_balance_of<CoinType>(composer);
    let singer_balance = Aptos::coin_balance_of<CoinType>(singer);
    let band_balance = Aptos::coin_balance_of<CoinType>(band);

    // Assuming 25%, 40%, 35% tip distribution
    let total_amount = <some_amount>;
    let composer_share = (total_amount * 25) / 100;
    let singer_share = (total_amount * 40) / 100;
    let band_share = (total_amount * 35) / 100;

    // Assert or check the state to ensure the tip distribution is done correctly
    assert(composer_balance == composer_share, 0x1);
    assert(singer_balance == singer_share, 0x2);
    assert(band_balance == band_share, 0x3);
}

}



>>>>>>> Stashed changes
