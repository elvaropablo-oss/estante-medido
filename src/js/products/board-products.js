export const verifiedAt='2026-09-12';

export const boardCriteria=[
  {key:'furnitureSuitable',label:'Apto para fabricación de muebles',weight:15,type:'boolean'},
  {key:'surfaceScore',label:'Preparación/acabado de superficie',weight:20,score:value=>Number.isFinite(Number(value))?Number(value):null},
  {key:'certifiedSourcing',label:'Madera de origen certificado',weight:15,type:'boolean'},
  {key:'lowHazard',label:'Bajas emisiones o ausencia de sustancias peligrosas declarada',weight:20,type:'boolean'},
  {key:'stabilityScore',label:'Resistencia/estabilidad declarada',weight:30,score:value=>Number.isFinite(Number(value))?Number(value):null}
];

export const boardProducts=[
  {
    id:'leroy-pino-macizo-200x60x18',name:'Tablero macizo de pino alistonado 200 × 60 × 1,8 cm',retailer:'Leroy Merlin',material:'Pino',length:200,width:60,thickness:1.8,price:25.79,verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/tablero-macizo-madera-pino-de-60x200cm-y-18mm-de-espesor-15531173.html',
    sourceUrl:'https://www.leroymerlin.es/productos/tablero-macizo-madera-pino-de-60x200cm-y-18mm-de-espesor-15531173.html',
    specs:{furnitureSuitable:true,surfaceScore:85,certifiedSourcing:true,lowHazard:null,stabilityScore:80},
    featureLabels:['Madera maciza','Cepillado','PEFC','Interior seco'],affiliate:{enabled:false,network:'awin',url:''}
  },
  {
    id:'leroy-abeto-macizo-200x60x18',name:'Tablero macizo de abeto 200 × 60 × 1,8 cm',retailer:'Leroy Merlin',material:'Abeto',length:200,width:60,thickness:1.8,price:37.99,verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/tablero-macizo-de-abeto-de-60x200x1-8-cm-12051081.html',
    sourceUrl:'https://www.leroymerlin.es/productos/tablero-macizo-de-abeto-de-60x200x1-8-cm-12051081.html',
    specs:{furnitureSuitable:true,surfaceScore:85,certifiedSourcing:true,lowHazard:true,stabilityScore:null},
    featureLabels:['Madera maciza','Cepillado','PEFC','Sin sustancias peligrosas declaradas'],affiliate:{enabled:false,network:'awin',url:''}
  },
  {
    id:'bauhaus-pino-laminado-200x60x18',name:'Tablero de madera laminada de pino 200 × 60 × 1,8 cm',retailer:'BAUHAUS',material:'Pino laminado',length:200,width:60,thickness:1.8,price:24.99,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/tablero-de-madera-laminada/p/29232491',
    sourceUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/tablero-de-madera-laminada/p/29232491',
    specs:{furnitureSuitable:true,surfaceScore:80,certifiedSourcing:null,lowHazard:true,stabilityScore:80},
    featureLabels:['Pino laminado','Lijado grano 80','Emisión E1','Uso interior'],affiliate:{enabled:false,network:'awin',url:''}
  },
  {
    id:'bauhaus-acacia-220x60x18',name:'Exclusivholz tablero laminado de acacia 220 × 60 × 1,8 cm',retailer:'BAUHAUS',material:'Acacia laminada',length:220,width:60,thickness:1.8,price:46.99,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/31205975',
    sourceUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/31205975',
    specs:{furnitureSuitable:true,surfaceScore:100,certifiedSourcing:null,lowHazard:true,stabilityScore:100},
    featureLabels:['Acacia laminada','Acabado al aceite','Alta durabilidad declarada','Sin sustancias tóxicas declaradas'],affiliate:{enabled:false,network:'awin',url:''}
  },
  {
    id:'bauhaus-abedul-220x60x18',name:'Exclusivholz tablero laminado de abedul 220 × 60 × 1,8 cm',retailer:'BAUHAUS',material:'Abedul laminado',length:220,width:60,thickness:1.8,price:42.99,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/14089182',
    sourceUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/14089182',
    specs:{furnitureSuitable:true,surfaceScore:50,certifiedSourcing:null,lowHazard:true,stabilityScore:100},
    featureLabels:['Abedul laminado','Alta resistencia a deformación declarada','Sin tratar','Sin sustancias tóxicas declaradas'],affiliate:{enabled:false,network:'awin',url:''}
  }
];
