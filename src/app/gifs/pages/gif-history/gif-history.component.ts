import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
@Component({
  selector: 'gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html',
})


export default class GifHistoryComponent {

  gifService = inject(GifService);
  // query = inject(ActivatedRoute).params.subscribe(
  //   (params) => {
  //     console.log(params['query']);
  //   }
  // );

  // con el ActivatedRoute vamos a obtener parametros  dinamicos de las URLs  en la propiedad query definida en los routes
  // se utiliza toSignal para transformar cualquier obervable a una señal
  // se usa el pipe para conectar los parametros de rxjs como el map
  query = toSignal(inject(ActivatedRoute).params.pipe(
    map( params => params['query'])
  ));

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));

 }
