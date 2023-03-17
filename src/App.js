import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSubmit = async e => {
        e.preventDefault();
        const [profileResponse, repositoriesResponse] = await Promise.all([
            axios.get(`https://api.github.com/users/${username}`),
            axios.get(`https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=10`),
        ]);
        setProfile(profileResponse.data);
        setRepositories(repositoriesResponse.data);
    };

    const handleNextPage = async () => {
        const response = await axios.get(`https://api.github.com/users/${username}/repos?page=${currentPage + 1}&per_page=10`);
        setRepositories(response.data);
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = async () => {
        const response = await axios.get(`https://api.github.com/users/${username}/repos?page=${currentPage - 1}&per_page=10`);
        setRepositories(response.data);
        setCurrentPage(currentPage - 1);
    };

    useEffect(() => {
        if (!username) {
            return;
        }

        const fetchProfileAndRepositories = async () => {
            const [profileResponse, repositoriesResponse] = await Promise.all([
                axios.get(`https://api.github.com/users/${username}`),
                axios.get(`https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=10`),
            ]);
            setProfile(profileResponse.data);
            setRepositories(repositoriesResponse.data);
        };

        fetchProfileAndRepositories();
    }, [username, currentPage]);

    return (
        <div className="App">
            <h1>GitHub Profile Viewer</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter a GitHub username:
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            {profile && (
                <div>
                    <h2>{profile.name}</h2>
                    <p>{profile.bio}</p>
                    <img src={profile.avatar_url} alt={`${profile.name}'s avatar`} />
                </div>
            )}
            <h3>Repositories:</h3>
            <ul>
                {repositories.map(repo => (
                    <li key={repo.id}>{repo.name}</li>
                ))}
            </ul>
            {repositories.length > 0 && (
                <div>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Prev
                    </button>
                    <button onClick={handleNextPage}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
