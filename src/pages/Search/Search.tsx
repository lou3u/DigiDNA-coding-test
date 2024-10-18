import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "../../utils/useDebounce";
import { useIndexedDB } from "react-indexed-db-hook";
import ArtistItem from "./components/ArtistItem";

export interface ResponseArtistModel {
    api_link: string,
    api_model: string,
    id: number,
    timestamp: Date,
    title: string,
    _score: number
}

export interface ArtistModel {
    id: number;
    title: string
}

const Search = () => {
    const { getAll, clear } = useIndexedDB('artist');

    const searchBarRef = useRef<HTMLInputElement>(null);

    const [searchValue, setSearchValue] = useState('');
    const [selectedArtists, setSelectedArtists] = useState<ArtistModel[]>([])
    const [showOnlySelectedItems, setShowOnlySelectedItems] = useState(false);

    const searchDebounced = useDebounce(searchValue, 200)
    const { data: results } = useQuery<{ data: ResponseArtistModel[] }>({
        queryKey: ['getArtistes', searchDebounced],
        queryFn: async () => {
            const res = await fetch(`https://api.artic.edu/api/v1/artists/search?q=${searchDebounced}`, {
                method: 'GET',
            })

            return res.json()
        },
        initialData: { data: [] },
        enabled: searchDebounced.length > 0,
    })
    const resultToDisplay = useMemo(() => {
        return showOnlySelectedItems ? selectedArtists : results.data.map(item => ({ ...item } as ArtistModel))
    }, [showOnlySelectedItems, selectedArtists, results])

    const refreshSelectedArtist = () => {
        getAll().then((artistsFromDB: (ArtistModel & { artistId: number })[]) => setSelectedArtists(artistsFromDB.map(art => ({ id: art.artistId, title: art.title }))))
    }

    const handleReset = () => {
        clear();
        refreshSelectedArtist();
        setSearchValue('');
        searchBarRef && searchBarRef.current && searchBarRef.current.focus()
    }

    useEffect(() => {
        refreshSelectedArtist()
    }, [])

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
            rowGap: '8px'
        }}>
            <input ref={searchBarRef} className="searchInput" type="text" value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)
                if (showOnlySelectedItems) {
                    setShowOnlySelectedItems(false)
                }

            }} placeholder="Search an artist name..." />
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                {
                    selectedArtists.length > 0 ? <><span className='actionText actionTextSelectedItem' style={{
                        textAlign: 'start'
                    }} onClick={() => { setShowOnlySelectedItems(true); setSearchValue(''); }}>
                        Show selected items ({selectedArtists.length})</span>
                        <span className="actionText actionTextSelectedItem" onClick={handleReset}>Reset</span>
                    </> : <span className='actionText' style={{
                        textAlign: 'start'
                    }}>
                        {selectedArtists.length} selected</span>
                }

            </div>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '8px'
        }}>

            {resultToDisplay.map(artist => {
                return <ArtistItem key={artist.id} artist={artist} refreshSelectedArtist={refreshSelectedArtist} isSelected={selectedArtists.findIndex(a => a.id === artist.id) > -1} />
            })}
        </div>
    </div>
}

export default Search