export function positive(value,label='El valor'){const number=Number(String(value).replace(',','.'));if(!Number.isFinite(number)||number<=0)throw new Error(`${label} debe ser mayor que cero.`);return number;}
export function nonNegative(value,label='El valor'){const number=Number(String(value).replace(',','.'));if(!Number.isFinite(number)||number<0)throw new Error(`${label} no puede ser negativo.`);return number;}
const whole=(value,label,max=100)=>{const number=nonNegative(value,label);if(!Number.isInteger(number)||number>max)throw new Error(`${label} debe ser un entero entre 0 y ${max}.`);return number;};

export function equalShelves({innerHeight,shelfCount,shelfThickness,reserveBottom=0,reserveTop=0}){
  const height=positive(innerHeight,'La altura interior');const count=whole(shelfCount,'El número de baldas');const thickness=positive(shelfThickness,'El grosor');const bottomReserve=nonNegative(reserveBottom,'La reserva inferior');const topReserve=nonNegative(reserveTop,'La reserva superior');
  const free=height-bottomReserve-topReserve-count*thickness;if(free<=0)throw new Error('No queda altura libre después de restar baldas y reservas.');
  const opening=free/(count+1);const shelves=Array.from({length:count},(_,index)=>{const lowerEdge=bottomReserve+(index+1)*opening+index*thickness;return{number:index+1,lowerEdge,topEdge:lowerEdge+thickness};});
  return{height,count,thickness,opening,bottomReserve,topReserve,shelves};
}

export function shelvesForItems({innerHeight,itemHeight,clearance=0,shelfThickness,reserveBottom=0,reserveTop=0}){
  const height=positive(innerHeight,'La altura interior');const item=positive(itemHeight,'El alto del objeto');const extra=nonNegative(clearance,'La holgura');const thickness=positive(shelfThickness,'El grosor');const reserves=nonNegative(reserveBottom,'La reserva inferior')+nonNegative(reserveTop,'La reserva superior');const required=item+extra;
  const count=Math.max(0,Math.floor((height-reserves-required)/(thickness+required)));const layout=equalShelves({innerHeight:height,shelfCount:count,shelfThickness:thickness,reserveBottom,reserveTop});
  if(layout.opening+1e-9<required)throw new Error('No cabe ni un hueco con la altura y reservas indicadas.');
  return{...layout,itemHeight:item,clearance:extra,required,openings:count+1};
}

export function bookcaseCutList({outerWidth,outerHeight,depth,panelThickness,shelfCount,setback=0,includeBack=false,backThickness=3}){
  const width=positive(outerWidth,'El ancho exterior');const height=positive(outerHeight,'El alto exterior');const panelDepth=positive(depth,'El fondo');const thickness=positive(panelThickness,'El grosor del tablero');const count=whole(shelfCount,'El número de baldas');const shelfSetback=nonNegative(setback,'El retranqueo');
  if(width<=2*thickness||height<=2*thickness)throw new Error('Las medidas exteriores deben superar dos veces el grosor del tablero.');if(shelfSetback>=panelDepth)throw new Error('El retranqueo debe ser menor que el fondo.');
  const innerWidth=width-2*thickness;const innerHeight=height-2*thickness;const parts=[{name:'Lateral',quantity:2,length:height,width:panelDepth,thickness},{name:'Tapa y base',quantity:2,length:innerWidth,width:panelDepth,thickness}];
  if(count)parts.push({name:'Balda interior',quantity:count,length:innerWidth,width:panelDepth-shelfSetback,thickness});
  if(includeBack){const back=positive(backThickness,'El grosor del trasero');parts.push({name:'Trasera superpuesta',quantity:1,length:height,width,thickness:back});}
  const panelArea=parts.reduce((sum,part)=>sum+part.length*part.width*part.quantity,0);
  return{width,height,depth:panelDepth,thickness,count,innerWidth,innerHeight,parts,panelArea};
}
