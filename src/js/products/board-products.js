export const verifiedAt='2026-09-12';

export const boardCriteria=[
  {key:'furnitureSuitable',label:'Apto para mobiliario declarado',weight:25,type:'boolean'},
  {key:'surfacePrepared',label:'Superficie preparada o acabada',weight:15,type:'boolean'},
  {key:'certifiedSourcing',label:'Origen de madera certificado',weight:15,type:'boolean'},
  {key:'lowEmissionOrHazard',label:'Bajas emisiones o ausencia de sustancias peligrosas declarada',weight:20,type:'boolean'},
  {key:'resistanceDeclared',label:'Resistencia o estabilidad declarada',weight:25,type:'boolean'}
];

const affiliate={enabled:false,network:'awin',url:''};

export const boardProducts=[
  {
    id:'leroy-pino-macizo-200x60x18',name:'Tablero macizo de pino alistonado 200 × 60 × 1,8 cm',retailer:'Leroy Merlin',material:'Pino',length:200,width:60,thickness:1.8,price:25.79,verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/tablero-macizo-madera-pino-de-60x200cm-y-18mm-de-espesor-15531173.html',
    sourceUrl:'https://www.leroymerlin.es/productos/tablero-macizo-madera-pino-de-60x200cm-y-18mm-de-espesor-15531173.html',
    specs:{furnitureSuitable:true,surfacePrepared:true,certifiedSourcing:true,lowEmissionOrHazard:null,resistanceDeclared:true},
    featureLabels:['Madera maciza','Cepillado','PEFC','Uso en muebles y estanterías'],affiliate:{...affiliate}
  },
  {
    id:'leroy-abeto-macizo-200x60x18',name:'Tablero macizo de abeto 200 × 60 × 1,8 cm',retailer:'Leroy Merlin',material:'Abeto',length:200,width:60,thickness:1.8,price:37.99,verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/tablero-macizo-de-abeto-de-60x200x1-8-cm-12051081.html',
    sourceUrl:'https://www.leroymerlin.es/productos/tablero-macizo-de-abeto-de-60x200x1-8-cm-12051081.html',
    specs:{furnitureSuitable:true,surfacePrepared:true,certifiedSourcing:true,lowEmissionOrHazard:true,resistanceDeclared:null},
    featureLabels:['Madera maciza','Cepillado','PEFC','Sin sustancias peligrosas declaradas'],affiliate:{...affiliate}
  },
  {
    id:'bauhaus-pino-laminado-200x60x18',name:'Tablero de madera laminada de pino 200 × 60 × 1,8 cm',retailer:'BAUHAUS',material:'Pino laminado',length:200,width:60,thickness:1.8,price:24.99,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/tablero-de-madera-laminada/p/29232491',
    sourceUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/tablero-de-madera-laminada/p/29232491',
    specs:{furnitureSuitable:true,surfacePrepared:true,certifiedSourcing:null,lowEmissionOrHazard:true,resistanceDeclared:true},
    featureLabels:['Pino laminado','Lijado grano 80','Emisión E1','Estabilidad dimensional declarada'],affiliate:{...affiliate}
  },
  {
    id:'bauhaus-wbp-250x122x18',name:'Tablero contrachapado WBP de pino 250 × 122 × 1,8 cm',retailer:'BAUHAUS',material:'Contrachapado de pino',length:250,width:122,thickness:1.8,price:64.49,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-contrachapado/tablero-contrachapado-wbp/p/29416417',
    sourceUrl:'https://www.bauhaus.es/tableros-de-contrachapado/tablero-contrachapado-wbp/p/29416417',
    specs:{furnitureSuitable:null,surfacePrepared:null,certifiedSourcing:null,lowEmissionOrHazard:true,resistanceDeclared:true},
    featureLabels:['Contrachapado WBP','Emisión E1','Resistente al agua y humedad','Formato 250 × 122 cm'],affiliate:{...affiliate}
  },
  {
    id:'bauhaus-acacia-220x60x18',name:'Exclusivholz tablero laminado de acacia 220 × 60 × 1,8 cm',retailer:'BAUHAUS',material:'Acacia laminada',length:220,width:60,thickness:1.8,price:46.99,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/31205975',
    sourceUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/31205975',
    specs:{furnitureSuitable:true,surfacePrepared:true,certifiedSourcing:null,lowEmissionOrHazard:true,resistanceDeclared:true},
    featureLabels:['Acacia laminada','Acabado al aceite','Alta durabilidad declarada','Sin sustancias tóxicas declaradas'],affiliate:{...affiliate}
  },
  {
    id:'bauhaus-abedul-220x60x18',name:'Exclusivholz tablero laminado de abedul 220 × 60 × 1,8 cm',retailer:'BAUHAUS',material:'Abedul laminado',length:220,width:60,thickness:1.8,price:42.99,verifiedAt,
    normalUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/14089182',
    sourceUrl:'https://www.bauhaus.es/tableros-de-madera-laminada/exclusivholz-tablero-de-madera-laminada/p/14089182',
    specs:{furnitureSuitable:true,surfacePrepared:false,certifiedSourcing:null,lowEmissionOrHazard:true,resistanceDeclared:true},
    featureLabels:['Abedul laminado','Sin tratar','Alta resistencia a deformación declarada','Sin sustancias tóxicas declaradas'],affiliate:{...affiliate}
  }
];
