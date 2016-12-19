import { Pipe, PipeTransform } from '@angular/core';

let pad = function(n:number, l:number=2) {
  let s = '0'.repeat(l) + String(n);
  return s.substring(s.length - l);
}

@Pipe({
  name: 'timeMs'
})
export class TimeMsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let h =  Math.floor(value/1000/60/60)%24;
    let m =  Math.floor(value/1000/60)%60;
    let s =  Math.floor(value/1000)%60;
    let ms = Math.floor(value%1000/100);
    return (h != 0 ? (h+':') : '') + pad(m) + ':' + pad(s) + '.' + pad(ms, 1);
  }

}
