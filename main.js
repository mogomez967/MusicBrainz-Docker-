import fetch from 'node-fetch';
import fs from 'fs';
const API = "https://musicbrainz.org/ws/2/";

async function get_artist(artist_name) {
  const response = await fetch(`${API}artist/?query=artist:${artist_name}&fmt=json`);
  const data = await response.json();

  if (data?.artists?.length > 0) {
    console.log(data.artists[0].name);
    return data.artists[0].name;
  } else {
    console.log('Artist not found');
    return null;
  }
}

// List all albums using the release API. Get title, date, and Status
async function get_albums(artist) {
  const response = await fetch(`${API}release/?query=artist:${artist}&fmt=json`);
  const data = await response.json();

  // use duoble quotes. What if album is was "The, end"?
  const csv = data.releases.map(release => [artist, release.country, release.title, release.date, release.status].join(','));
  return csv;
}

async function make_csv(data) {
  const csvContent = data.join('\n');
  const header = 'Artist,Country,Title,Date,Status\n';
  fs.writeFile('output.csv', header + csvContent, (err) => {
    if (err) throw err;
    console.log('CSV file created successfully');
  });
}

async function main() {
  const artist_name = process.argv[2];

  if (!artist_name) {
    console.log('Please provide an artist name as an argument');
    return;
  }
  
  const artist = await get_artist(artist_name);
  const album_data = await get_albums(artist);
  console.log(album_data);

  make_csv(album_data);
}

main();