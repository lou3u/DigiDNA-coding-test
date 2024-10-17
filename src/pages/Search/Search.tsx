import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useDebounce from "../../utils/useDebounce";
import { useIndexedDB } from "react-indexed-db-hook";

interface ResponseArtistModel {
    api_link: string,
    api_model: string,
    id: number,
    timestamp: Date,
    title: string,
    _score: number
}

// /search?q={searchTerm}
const Search = () => {
    const { add, getAll, getByIndex, deleteRecord } = useIndexedDB('artist');
    const [searchValue, setSearchValue] = useState('');
    const [selectedArtists, setSelectedArtists] = useState<number[]>([])

    const searchDebounced = useDebounce(searchValue)
    const { data: results } = useQuery<{ data: ResponseArtistModel[] }>({
        queryKey: ['getArtistes', searchDebounced],
        queryFn: async () => {
            return await fetch(`https://api.artic.edu/api/v1/artists/search?q=${searchDebounced}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
                // Create an object URL for the response
                .then((response) => response.json())
        },
        initialData: { data: [] },
        enabled: searchDebounced.length > 0
    })

    const handleAddArtist = async (artistToAdd: ResponseArtistModel) => {
        const artistinIndexDb = await getByIndex("artistId", artistToAdd.id)
        if (artistinIndexDb) {
            deleteRecord(artistinIndexDb.id)
        } else {
            add({ title: artistToAdd.title, artistId: artistToAdd.id })
        }
    }

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '16px',
        width: '400px',
        padding: '16px'
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <input className="searchInput" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Type an artist name" />
            <span style={{
                textAlign: 'start'
            }}>0 selected</span>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '8px'
        }}>

            {results.data.map(artist => {
                return <span key={artist.id} className="artist" onClick={() => handleAddArtist(artist)}>{artist.title}</span>
            })}
        </div>
    </div>
}

export default Search