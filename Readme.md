# PeerPlay : Decentralizing Music, Monetizing Art.

## Usage
1. Install the [Petra Aptos Wallet](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci/) browser extension.
2. Follow the steps to complete the signup, switch the network to Testnet and get yourself some APT coins(10 ideally) from the Faucet so that you can perform the transactions.
3. Now, you can either visit our deployed link [here]([https://www.google.com](https://on-chain-radio-shlok-007.vercel.app/)) or run the frontend locally(explained later).
4. Additionally, you can also visit the [Aptos Explorer](https://explorer.aptoslabs.com/account/0x3ee935265adc5cb16f3fe98c486ff9c3bb472d79e217212cf70beca6fddcff12/modules/run/community?network=testnet) to interact with the backend functions directly.

### Run Locally
1. Clone the repo
2. Run the following commands:
   ```
   cd client
   npm i
   npm start
   ```

## Overview
- We have used the **Move** language for backend and deployed on the Aptos Network(Testnet) through a **resource account**.
- For data storage, we have used **IPFS** via **Pinata's API**.
- For frontend, **React-Typescript** has been used with a variety of UI libraries.

## Backend Implementation
The entire backend is  divided into 4 modules(can be found in the /move folder):
- user.move
- song.move
- songStore.move
- community.move

All of the modules are deployed via a [resource account](https://aptos.dev/move/move-on-aptos/resource-accounts/) in order to ensure immutability and zero-interference.

Here the details of each of the modules.

### 1. The **user** module
This module is responsible for creating, updating, and managing user profiles. It also handles user authentication and authorization.

#### Structures

1. `Account`: This structure represents a user account. It includes the following fields:
    - `wallet_address`: The address of the user's wallet.
    - `name`: The name of the user.
    - `email`: The email of the user.
    - `bio`: A `Bio` structure that contains additional information about the user.
    - `premium`: A boolean value indicating whether the user has a premium subscription.
    - `subscription_expiry`: A timestamp indicating when the user's subscription expires.

2. `Bio`: This structure represents a user's biography. It includes the following fields:
    - `location`: The user's location.
    - `profession`: The user's profession.
    - `about`: A brief description of the user.
    - `profile_img_hash`: The IPFS hash of the user's profile image.

#### Functions

1. `create_account()`: This function is used to create a new user account. It takes a signer reference, a name, and an email as input. The signer reference is used to derive the wallet address.

2. `remove_account()`: This function is used to remove an existing user account. It takes a signer reference as input. The signer reference is used to derive the wallet address.

3. `subscribe_to_premium()`: This function is used to subscribe a user to a premium account. It takes a signer reference as input. The function checks if the user exists, if the user is already a premium subscriber, and if the user has sufficient funds to subscribe. It then fetches the subscription price from `community::CommunityParams`,calculates the premium price and distributes it among the premium artists and the admin.

4. `update_bio()`: This function is used to update the biography of a user. It takes a signer reference and all the elements for `Bio` structure as input and updates the `Account`'s `Bio` corresponding to the signer.

5. `validate_subscription()`: This function is used to validate a user's subscription by comparing the `subscription_expiry` field of user's `Account` to the current VM time. If the subscription has expired, it sets the `premium` field to false.

### The **song** module
This module is responsible for uploading, updating, and managing songs. It also handles song reporting and removal.

#### Structures

1. `ArtistStore`: This structure represents an artist's store. It includes the following fields:
    - `artist_address`: The address of the artist.
    - `songs`: A table mapping song IDs to `Song` structures.
    - `num_songs`: The number of songs in the artist's store.

#### Functions


1. `register_artist()`: This function is used to register a new artist. It checks if the account exists and if the artist is already registered. If not, it creates a new artist store and moves it to the artist's account.

2. `upload_song()`: This function is used to upload a new song. It checks if the artist exists and if not, registers the artist. It then creates a new song and adds it to the artist's store and the song store.

3. `remove_song()`: This utility function is used to remove a song from an artist's store. It removes the song from the artist's songs table.

4. `remove_song_by_artist()`: This function is used to remove a song by an artist. It checks if the artist exists and if the artist is the owner of the song. If so, it removes the song from the artist's store and the song store.

5. `remove_reported_song()`: This utility function is used to remove a reported song. It removes the song from the artist's store and the song store.

6. `report_song()`: This function is used to report a song. It checks if the reporter exists and if the artist exists. It then reports the song in the song store. If the number of reports exceeds the report threshold, it removes the reported song.

### The **songStore** module
This module is responsible for managing the global song store. It is essential for song streaming. It includes structures for songs, song libraries, genres, new arrivals, and trending songs. It also allows for the addition, removal, tipping and retrieval of songs.

#### Structures

1. `Song`: This structure represents a song. It includes fields for the song and artist IDs, artist wallet address, title, IPFS hashes for the song and cover image, total tips, premium status, genre, contributors (vocalist, lyricist, musician, audio engineer), number of reports, and reporters.

2. `SongStore`: This structure represents the global song store. It includes fields for premium songs, free songs, premium artists, number of premium artists, new arrivals, and trending songs.

3. `SongLibrary`: This structure represents a song library. It includes fields for songs (organized by genre), number of genres, and a list of genres.

4. `Genre`: This structure represents a genre. It includes fields for songs (organized by song ID) and the number of songs in the genre.

5. `NewArrivals`: This structure represents the new arrivals. It includes fields for songs (organized by an index), number of songs, maximum number of songs, and the index of the oldest song.

6. `TrendingSongs`: This structure represents the trending songs. Total tips received by a song decides whether it is trending or not. It includes fields for songs (organized by an index), number of songs, maximum number of songs, and the index of the least trending song.

#### Functions

1. `init_module(resource_signer: &signer)`: Initializes the song store module.

2. `add_song_to_songStore(artist_acc: &signer, song: Song)`: Utility function that adds a song to the song store.

3. `tip_song(tipper: &signer, song_store_ID: u64, genre: String, premium: bool, tip_amount: u64)`: This function in the songStore.move module allows a user to tip a song. It checks if the tipper has enough balance, calculates the artist's cut, transfers the tip amount, updates the total tips of the song, and adds the tipped song to the trending songs list.

4. `add_to_new_arrivals(new_arrivals: &mut NewArrivals, song: Song)`: Utility function that adds a song to the new arrivals.

5. `update_least_trending(trending_songs: &mut TrendingSongs)`: Utility function that updates the least trending song.

6. `add_to_trending_songs(trending_songs: &mut TrendingSongs, song: Song)`: Utility function that adds a song to the trending songs.

7. `report_song(reporter: &signer, song: &mut Song)`: Utility function that reports a song.

8. `remove_song(song: Song)`: Utility function that removes a song from the song store.

9. `add_to_song_library(song_library: &mut SongLibrary, song: Song)`: Utility function that adds a song to the song library.

10. `instantiate_song(...)`: Instantiates a song.

11. **View Functions**: This module also contains various [view functions](https://move-developers-dao.gitbook.io/aptos-move-by-example/advanced-concepts/view-functions/) to be used by other modules like:

- `get_song_title(song: &Song)`: Returns the title of a song.

- `get_song_artist_addr(song: &Song)`: Returns the artist address of a song.

- `get_song_reports(song: &Song)`: Returns the number of reports of a song.

- `get_premium_artists_list()`: Returns the list of premium artists.


### The **community** module
This module is essential for community governance. It allows the users to create, vote and end polls for changing the community parameters. This takes the role of governance from a centralized entity and gives it to the community.

#### Structures

1. `CommunityParams`: A resource that stores the community parameters, namely:
- Artists' cut on premium subscription
- Artists' cut on Tips
- Premium subscription price
- Report Threshold (when a song receives this number of reports, it is removed)

2. `Poll4ArtistPremiumCut`, `Poll4ArtistGenCut`, `Poll4PremiumPrice`, `Poll4ReportThreshold`: Resources that represent polls for changing the respective community parameters. Each poll stores the proposed value, justification, votes for and against the proposed value, end time, and voters.

#### Functions

1. `init_module(community_signer: &signer)`: Initializes the module with default community parameters.

2. `create_poll(proposed_value: u64, justification: String, poll_type: u8)`: Creates a poll for changing a community parameter. The type of poll (artist premium cut, artist general cut, premium price, or report threshold) is determined by the poll_type parameter.

3. `vote(voter: &signer, vote: bool, poll_type: u8)`: Allows a user to vote in a poll. The vote parameter indicates whether the user votes for or against the proposed value.

4. `end_poll(poll_type: u8)`: Ends a poll if the pole has ended and updates the community parameter if the majority voted for the proposed value.

5. **View Functions**: This module provides 4 view functions to allow other modules to fetch the community parameters. The functions are:

- `get_report_threshold()`: Returns the current report threshold.

- `get_premium_price()`: Returns the current premium price.

- `get_artist_gen_cut()`: Returns the current artist general cut.

- `get_artist_premium_cut()`: Returns the current artist premium cut.

## Data Storage
The Data Storage module in your React app manages song data upload and storage, connecting with external APIs, enabling IPFS file pinning, and ensuring secure blockchain-backed data handling. It encompasses the `UploadForm`, `ImageUpload`, and `AudioUpload` components, streamlining the upload process for songs.

### Important Notes
- Ensure the ImageUpload and AudioUpload components are correctly implemented to handle image and audio file uploads, respectively.
- Set up environmental variables (`REACT_APP_PINATA_API_KEY` and `REACT_APP_PINATA_API_SECRET`) for Pinata API credentials for successful file uploads.
- Modify the form fields, input validations, and transaction submission logic as needed based on your application's requirements.

### Functionalities
- Handles song information such as song name, vocalist, lyricist, musician, and audio engineer details.
- Allows selection of song genre and premium status.
- Uploads image and audio files using the Pinata API for pinning to IPFS.
- Submits song-related information to the blockchain after successful wallet connection and validation checks.

## Frontend Implementation'

In the project directory, ``` client ``` contains the frontend of the application

### These are the Frontend pages employed

### Authentication Page
- **Description:** Handles user authentication, connecting wallets, and account creation.
- **Dependencies:** React, React Router DOM, Wallet Adapter (Ant Design), Aptos
- **Usage:** Renders an authentication form for user login/signup, integrates wallet functionalities, and manages user avatars.

### Community Page
- **Description:** Fetches and displays community parameters and polls from Aptos network.
- **Dependencies:** React, Aptos
- **Usage:** Shows community parameters, polls, and enables user interactions for voting.

### Dashboard Page
- **Description:** Renders a tabbed dashboard layout using Material-UI.
- **Dependencies:** React, Material-UI
- **Usage:** Provides tab navigation for insights, transactions, and profile sections.

### Home Page
- **Description:** Displays the main landing page with a hero section and song exploration area.
- **Dependencies:** React
- **Usage:** Serves as the main entry point for user interaction and song exploration.

### LearnMore Page
- **Description:** Presents detailed information about PeerPlay's features, statistics, and popular artists.
- **Dependencies:** React
- **Usage:** Provides users with additional insights about PeerPlay's key aspects.

### PlayRadio Page
- **Description:** Represents a music player with functionalities like play/pause, song selection, duration display, and modal integration.
- **Dependencies:** React, react-router-dom, aptos, @fortawesome/react-fontawesome
- **Usage:** Controls music playback, song details, and premium access.

### Subscribe Page
- **Overview:** Handles subscription plans and transactions within the application.
- **Usage:** Facilitates subscription options and wallet connections for accessing premium features.
- **Dependencies:** React, Aptos Client, Wallet Adapter React, React Router DOM

### Upload Page
- **Overview:** Renders a structured form for uploading songs within the application.
- **Usage:** Facilitates the song upload process.
- **Dependencies:** React
