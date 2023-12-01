module addr_on_chain_radio::song{
import 0x1::std::address;
import 0x1::std::string::String;
import 0x1::std::vec::Vec;
import 0x1::aptos_std::event;
import 0x1::aptos_crypto::Crypto;

resource struct Song {
    id: u64,
    artist: address,
    title: vector<u8>,
    content: vector<u8>,
    tip_pool: u64,
}

resource struct UserProfile {
    user: address,
    listened_tracks: Vec<u64>,
}

resource struct Artist {
    address: address,
    authorized: bool,
}


resource struct Tip {
    sender: address,
    amount: u64,
}

//event Tipped(artist: address, user: address, amount: u64);

public struct TipDistributionEvent {
    sender: address,
    artist: address,
    amount: u64,
}

//sets
//public mutable set<address> AuthorizedUsers;
//public mutable set<address> AuthorizedArtists;

public fun upload_Song(title: vector<u8>, content: vector<u8>) {
    let artist: address = signer();
    let id: u64 = AptosCrypto::random_u64(); 

    let song = Song {
        id: id,
        artist: artist,
        title: title,
        content: content,
        tip_pool:0,
    };

    move_to<Song>(artist,song);
}

public fun listen_Song(user: &signer, track_id: u64) {
        let user_address = signer::address_of(user);

        // song from stor
        let track = move_from<Song>(move(id));

        // Add to user listen tracks
        let mut user_profile = move_from_opt<UserProfile>(move(user_address));

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

    public fun authorizeArtist(artist: address, authorized: bool) {
        let artistResource = &mut Artist{address: artist, authorized: authorized};
        move_to_sender(artistResource);
    }

    public fun tip(sender: address, composer: address, singer: address, band: address, amount: u64) {
        let composerResource = borrow_global_mut<Artist>(composer);
        let singerResource = borrow_global_mut<Artist>(singer);
        let bandResource = borrow_global_mut<Artist>(band);

        if !composerResource.authorized {
            abort("Composer is not authorized");
        }
        if !singerResource.authorized {
            abort("Singer is not authorized");
        }
        if !bandResource.authorized {
            abort("Band is not authorized");
        }

    let total_amount = Aptos::coin_balance_of<CoinType>(sender);
    assert(total_amount >= amount, 0x0);
    
    //(25:40:35 distri)
    let composer_share = (amount * 25) / 100;
    let singer_share = (amount * 40) / 100;
    let band_share = (amount * 35) / 100;

    //total to be amt
    assert(composer_share + singer_share + band_share == amount, 0x1);

    Aptos::coin_transfer<CoinType>(sender, composer, composer_share);
    Aptos::coin_transfer<CoinType>(sender, singer, singer_share);
    Aptos::coin_transfer<CoinType>(sender, band, band_share);

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
}