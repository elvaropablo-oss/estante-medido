const num=value=>Number(String(value).replace(',','.'));
const area=(length,width)=>length*width;

export function expandCutParts(parts=[],thickness,{tolerance=0.011}={}){
  const target=num(thickness);
  if(!(target>0))return[];
  const expanded=[];
  for(const part of parts){
    const partThickness=num(part?.thickness);
    const length=num(part?.length),width=num(part?.width),quantity=Math.max(0,Math.floor(num(part?.quantity)));
    if(!(length>0)||!(width>0)||!quantity||Math.abs(partThickness-target)>tolerance)continue;
    for(let i=0;i<quantity;i++)expanded.push({id:`${part.name||'Pieza'}-${i+1}`,name:part.name||'Pieza',length,width,thickness:partThickness,area:area(length,width)});
  }
  return expanded.sort((a,b)=>Math.max(b.length,b.width)-Math.max(a.length,a.width)||b.area-a.area);
}

function candidates(piece,allowRotate){
  const list=[{length:piece.length,width:piece.width,rotated:false}];
  if(allowRotate&&Math.abs(piece.length-piece.width)>1e-9)list.push({length:piece.width,width:piece.length,rotated:true});
  return list;
}

function fitInShelf(board,piece,kerf,allowRotate){
  let best=null;
  for(let shelfIndex=0;shelfIndex<board.shelves.length;shelfIndex++){
    const shelf=board.shelves[shelfIndex];
    for(const option of candidates(piece,allowRotate)){
      if(option.width>shelf.height+1e-9)continue;
      const extra=(shelf.items.length?kerf:0)+option.length;
      if(shelf.used+extra>board.length+1e-9)continue;
      const remaining=board.length-(shelf.used+extra);
      if(!best||remaining<best.remaining)best={kind:'existing',shelfIndex,option,remaining,extra};
    }
  }
  return best;
}

function fitAsNewShelf(board,piece,kerf,allowRotate){
  let best=null;
  const usedWidth=board.shelves.reduce((sum,shelf)=>sum+shelf.height,0)+(board.shelves.length?kerf*(board.shelves.length-1):0);
  for(const option of candidates(piece,allowRotate)){
    if(option.length>board.length+1e-9)continue;
    const extraWidth=(board.shelves.length?kerf:0)+option.width;
    if(usedWidth+extraWidth>board.width+1e-9)continue;
    const remainingWidth=board.width-(usedWidth+extraWidth);
    if(!best||remainingWidth<best.remainingWidth)best={kind:'new',option,remainingWidth};
  }
  return best;
}

function place(board,piece,fit){
  if(fit.kind==='existing'){
    const shelf=board.shelves[fit.shelfIndex];
    const x=shelf.used+(shelf.items.length?board.kerf:0);
    shelf.used=x+fit.option.length;
    shelf.items.push({...piece,...fit.option,x,y:shelf.y});
    return;
  }
  const y=board.shelves.length?board.shelves.at(-1).y+board.shelves.at(-1).height+board.kerf:0;
  board.shelves.push({y,height:fit.option.width,used:fit.option.length,items:[{...piece,...fit.option,x:0,y}]});
}

function createBoard(length,width,kerf){return{length,width,kerf,shelves:[]};}

export function optimizeBoardCuts(parts,product,{targetThickness,kerf=0.3,allowRotate=false}={}){
  const stockLength=num(product?.length),stockWidth=num(product?.width),stockThickness=num(product?.thickness),price=num(product?.price);
  const desired=num(targetThickness),cut=Math.max(0,num(kerf)||0);
  if(!(stockLength>0)||!(stockWidth>0)||!(stockThickness>0)||!(price>=0)||!(desired>0))return{compatible:false,reason:'Datos de tablero incompletos'};
  if(Math.abs(stockThickness-desired)>0.011)return{compatible:false,reason:`Grosor ${stockThickness} cm distinto de ${desired} cm`};
  const pieces=expandCutParts(parts,desired);
  if(!pieces.length)return{compatible:false,reason:'No hay piezas de ese grosor'};
  const boards=[];
  for(const piece of pieces){
    let chosen=null,chosenBoard=null;
    for(const board of boards){
      const existing=fitInShelf(board,piece,cut,allowRotate);
      const fresh=fitAsNewShelf(board,piece,cut,allowRotate);
      const fit=existing||fresh;
      if(fit){chosen=fit;chosenBoard=board;break;}
    }
    if(!chosen){
      const board=createBoard(stockLength,stockWidth,cut);
      const fit=fitAsNewShelf(board,piece,cut,allowRotate);
      if(!fit)return{compatible:false,reason:`La pieza ${piece.name} (${piece.length} × ${piece.width} cm) no cabe en el tablero`};
      boards.push(board);chosen=fit;chosenBoard=board;
    }
    place(chosenBoard,piece,chosen);
  }
  const pieceArea=pieces.reduce((sum,piece)=>sum+piece.area,0);
  const boardArea=area(stockLength,stockWidth);
  const purchasedArea=boards.length*boardArea;
  const wasteArea=Math.max(0,purchasedArea-pieceArea);
  return{
    compatible:true,
    units:boards.length,
    pieces:pieces.length,
    boardArea:boardArea/10000,
    pieceArea:pieceArea/10000,
    purchasedArea:purchasedArea/10000,
    wasteArea:wasteArea/10000,
    wastePct:purchasedArea>0?wasteArea/purchasedArea*100:0,
    projectCost:boards.length*price,
    unitCost:price/(boardArea/10000),
    kerf:cut,
    allowRotate:Boolean(allowRotate),
    boards
  };
}
