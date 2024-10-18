import { useIndexedDB } from "react-indexed-db-hook";
import { ArtistModel } from "../Search";

interface Props {
    artist: ArtistModel;
    refreshSelectedArtist: () => void
    isSelected: boolean
}

const ArtistItem = ({ artist, refreshSelectedArtist, isSelected }: Props) => {
    const { add, getByIndex, deleteRecord } = useIndexedDB('artist');

    const handleAddArtist = async (artistToAdd: ArtistModel) => {
        const artistinIndexDb = await getByIndex("artistId", artistToAdd.id)
        if (artistinIndexDb) {
            deleteRecord(artistinIndexDb.id)
        } else {
            add({ title: artistToAdd.title, artistId: artistToAdd.id })
        }

        refreshSelectedArtist()
    }

    return <div className="artist" style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '8px'
    }} onClick={() => handleAddArtist(artist)}>
        <input type="checkbox" style={{
            cursor: 'pointer'
        }} checked={isSelected} onChange={(e) => { e.preventDefault(); e.stopPropagation() }}></input>
        <span >{artist.title}</span>
    </div>
}

export default ArtistItem;