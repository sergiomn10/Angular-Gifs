import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';


const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
    const gifsFromToLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
    const gifs = JSON.parse(gifsFromToLocalStorage);

    console.log(gifs);
    return gifs;
};


@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage()); // record es para tipar  un objeto cuando sus llaves son dinamicas en este caso el String (los textos de busqueda) con la llave.
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory())); // computed es una señal computada, donde cada que cambie el this.searchHistory se dispara el computed

  constructor() {
    this.loadTrendingGifs();
  }

  //   es un efecto para guardar en el localStorage
  safeGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs', historyString);
  });

  loadTrendingGifs() {
    // la peticion no se dispara hasta que se suscribe (.subscribe(...)
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApikey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGiArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log(gifs);
      });
  }

  // Un metodo que retorna un Observable para que se subscriba en otra parte
  // y se pueda obetener el response de la peticion
  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApikey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGiArray(items)),
        // tap es un efecto secundario que servira para consultar el historial
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLocaleLowerCase()]: items,
          }));
        })
      );
    // .subscribe( (resp) => {
    //     // const gifs = GifMapper.mapGiphyItemsToGiArray(resp.data);
    //     // this.trendingGifs.set(gifs);
    //     // this.trendingGifsLoading.set(false);
    //     console.log(resp);

    // } );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
