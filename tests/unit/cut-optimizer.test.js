import test from 'node:test';
import assert from 'node:assert/strict';
import { bookcaseCutList } from '../../src/js/math/shelves.js';
import { optimizeBoardCuts } from '../../src/js/math/cut-optimizer.js';

const cut=bookcaseCutList({outerWidth:80,outerHeight:180,depth:30,panelThickness:1.8,shelfCount:4,setback:0,includeBack:false,backThickness:.3});

test('wide 250x122 board fits the default cut list in one board with 3 mm kerf',()=>{
  const result=optimizeBoardCuts(cut.parts,{length:250,width:122,thickness:1.8,price:64.49},{targetThickness:cut.thickness,kerf:.3,allowRotate:false});
  assert.equal(result.compatible,true);
  assert.equal(result.units,1);
  assert.equal(result.projectCost,64.49);
  assert.ok(Math.abs(result.pieceArea-2.4552)<1e-9);
  assert.ok(result.wastePct>19&&result.wastePct<20);
});

test('200x60 boards need extra units when the saw kerf is respected',()=>{
  const result=optimizeBoardCuts(cut.parts,{length:200,width:60,thickness:1.8,price:24.99},{targetThickness:cut.thickness,kerf:.3,allowRotate:false});
  assert.equal(result.compatible,true);
  assert.equal(result.units,5);
  assert.equal(result.projectCost,124.95);
});

test('a different thickness is rejected instead of silently substituted',()=>{
  const result=optimizeBoardCuts(cut.parts,{length:244,width:122,thickness:1.9,price:45},{targetThickness:cut.thickness,kerf:.3});
  assert.equal(result.compatible,false);
  assert.match(result.reason,/Grosor/);
});
