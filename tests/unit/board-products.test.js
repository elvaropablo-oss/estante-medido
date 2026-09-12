import test from 'node:test';
import assert from 'node:assert/strict';
import { boardCriteria, boardProducts, verifiedAt } from '../../src/js/products/board-products.js';

test('el catálogo de tableros tiene datos comerciales válidos e IDs únicos',()=>{
  assert.equal(boardProducts.length,6);
  assert.equal(new Set(boardProducts.map(product=>product.id)).size,boardProducts.length);
  for(const product of boardProducts){
    assert.ok(product.id&&product.name&&product.retailer);
    for(const key of ['length','width','thickness','price'])assert.ok(Number.isFinite(product[key])&&product[key]>0,`${product.id}: ${key} inválido`);
    assert.match(product.normalUrl,/^https:\/\//,`${product.id}: URL oficial inválida`);
    assert.match(product.sourceUrl,/^https:\/\//,`${product.id}: fuente inválida`);
    assert.equal(product.verifiedAt,verifiedAt);
  }
});

test('la afiliación permanece desactivada hasta tener enlaces reales',()=>{
  for(const product of boardProducts){
    assert.equal(product.affiliate?.enabled,false,`${product.id}: afiliación activada sin validar`);
    assert.equal(product.affiliate?.network,'awin');
    assert.equal(product.affiliate?.url,'');
  }
});

test('el índice técnico usa solo criterios booleanos documentales y suma 100',()=>{
  assert.equal(boardCriteria.reduce((sum,criterion)=>sum+criterion.weight,0),100);
  for(const criterion of boardCriteria)assert.equal(criterion.type,'boolean');
  for(const product of boardProducts){
    for(const criterion of boardCriteria){
      assert.ok(Object.hasOwn(product.specs,criterion.key),`${product.id}: falta ${criterion.key}`);
      assert.ok([true,false,null].includes(product.specs[criterion.key]),`${product.id}: ${criterion.key} no es boolean/null`);
    }
  }
});

test('fecha de verificación en ISO',()=>{
  assert.match(verifiedAt,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(new Date(`${verifiedAt}T00:00:00Z`).getTime()));
});
