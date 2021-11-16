import React, {useState} from 'react';

export default function Homepage() {
  const url = 'https://graphql.anilist.co';
  const [html, setHTML] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    let query = `
      query ($page: Int, $perPage: Int, $type: MediaType, $search: String) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            currentPage,
            lastPage
          },
          media (type: $type, search: $search) {
            id,
            title {
              romaji,
            },
            coverImage {
              large
            }
          }
        }
      }`
    let variables = {
      page: e.target.page.value,
      perPage: 10,
      type: e.target.type.value,
      search: e.target.search.value
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      }),
    })
      .then(res => res.json())
      .then(data => {
        let html = '';
        if (e.target.type.value === 'ANIME') {
          html += `<h2>Search results</h2><table><thead><tr><th>Cover</th><th>Anime</th></tr></thead><tbody>`
          for (let i = 0; i < data.data.Page.media.length; i++) {
            html += `<tr><td><img src=${data.data.Page.media[i].coverImage.large} alt="cover"></td>
                <td><a href="https://anilist.co/anime/${data.data.Page.media[i].id}" target="_blank">${data.data.Page.media[i].title.romaji}</a></td>`;
          }
        } else if (e.target.type.value === 'MANGA') {
          html += `<h2>Search results</h2><table><thead><tr><th>Cover</th><th>Manga</th></tr></thead><tbody>`
          for (let i = 0; i < data.data.Page.media.length; i++) {
            html += `<tr><td><img src=${data.data.Page.media[i].coverImage.large} alt="cover"></td>
                <td><a href="https://anilist.co/manga/${data.data.Page.media[i].id}" target="_blank">${data.data.Page.media[i].title.romaji}</a></td>`;
          }
        }
        html += `<tfoot>Page: ${data.data.Page.pageInfo.currentPage} of ${data.data.Page.pageInfo.lastPage}</tfoot></tbody></table>`
        setHTML(html)
      })
  }
    return (
    <div>
      <h1>JY's AniApp</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="type">Type&nbsp;</label>
        <select id="type" name="type">
          <option value="ANIME">Anime</option>
          <option value="MANGA">Manga</option>
        </select>
        <label htmlFor="search">Search&nbsp;</label>
        <input type="search" id="search" name="search" />
        <label htmlFor="page">Page #&nbsp;</label>
        <input type="number" id="page" name="page" defaultValue="1" />
        <button type="submit">Search</button>
      </form>
      <section dangerouslySetInnerHTML={{__html: html}}></section>
    </div>
  );
}