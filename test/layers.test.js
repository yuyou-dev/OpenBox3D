import test from 'node:test';
import assert from 'node:assert/strict';
import { dpiOf } from '../src/design/layers.js';

const imageLayer = overrides => ({
  kind: 'image',
  imgW: 600,
  imgH: 300,
  pxw: 600,
  w: 50.8,
  h: 25.4,
  ...overrides
});

test('dpiOf uses both full-image dimensions when no crop is set', () => {
  assert.equal(dpiOf(imageLayer()), 300);
});

test('dpiOf returns the lower DPI after non-uniform scaling', () => {
  assert.equal(dpiOf(imageLayer({ h: 50.8 })), 150);
});

test('dpiOf uses the cropped pixel dimensions on both axes', () => {
  const cropped = { imgW: 4000, imgH: 2000, pxw: 4000, crop: [0.1, 0.2, 0.5, 0.25] };
  assert.equal(dpiOf(imageLayer({ ...cropped, w: 127, h: 25.4 })), 400);
  assert.equal(dpiOf(imageLayer({ ...cropped, w: 101.6, h: 50.8 })), 250);
});

test('dpiOf returns zero for non-image layers or missing dimensions', () => {
  assert.equal(dpiOf({ kind: 'text', pxw: 600, w: 50.8 }), 0);
  assert.equal(dpiOf({ kind: 'image', pxw: 600, w: 50.8 }), 0);
  assert.equal(dpiOf({ kind: 'image', pxw: 600, w: 0, h: 25.4 }), 0);
});
