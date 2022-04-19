import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';



class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchResults: [],
			playlistName: 'New Playlist',
			playlistTracks: []
		}

		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}

	addTrack(track) {
		// .find would be an alternative
		const playlist = this.state.playlistTracks;

		for (let i = 0; i < playlist.length; i++) {
			if (track.id === playlist[i].id) return;
		}

		playlist.push(track);
		this.setState({ playlistTracks: playlist });
	}

	removeTrack(track) {
		const playlist = this.state.playlistTracks;

		const removableTrack = playlist.find(e => e.id === track.id);
		
		if (removableTrack) {
			const removableIndex = playlist.indexOf(removableTrack);
			playlist.splice(removableIndex, 1);
			this.setState({ playlistTracks: playlist });
		}
	}

	updatePlaylistName(name) {
		this.setState({ playlistName: name });
	}

	savePlaylist() {
		const playlist = this.state.playlistTracks;
		const trackUris = playlist.map(track => track.uri);

		Spotify.savePlaylist(this.state.playlistName, trackUris)
			.then(() => {
				this.setState({
					playlistName: 'New Playlist',
					playlistTracks: []
				})
			})
	}

	search(term) {
		Spotify.search(term)
			.then(searchResults => {
				this.setState({ searchResults: searchResults });
			});
	}

	render() {
		return (
		<div>
			<h1>Ja<span className="highlight">mmm</span>ing</h1>
			<div className="App">
				<SearchBar onSearch={this.search}/>
				<div className="App-playlist">
					<SearchResults	searchResults={this.state.searchResults}
									onAdd={this.addTrack}
					/>
					<Playlist   playlistName={this.state.playlistName}
								playlistTracks={this.state.playlistTracks}
								onRemove={this.removeTrack}
								onNameChange={this.updatePlaylistName}
								onSave={this.savePlaylist}
					/>
				</div>
			</div>
		</div>
		)
	}
}

export default App;
