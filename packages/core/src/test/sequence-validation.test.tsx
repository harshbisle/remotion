/**
 * @vitest-environment jsdom
 */
import {render} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {describe, expect, test} from 'vitest';
import {CanUseRemotionHooksProvider} from '../CanUseRemotionHooks.js';
import {Sequence} from '../Sequence.js';
import {expectToThrow} from './expect-to-throw.js';
import {WrapSequenceContext} from './wrap-sequence-context.js';

describe('Composition-validation render should throw with invalid props', () => {
	describe('Throw with invalid duration props', () => {
		test('It should throw if Sequence has non-integer durationInFrames', () => {
			expect(
				renderToString(
					<CanUseRemotionHooksProvider>
						<WrapSequenceContext>
							<Sequence from={0} durationInFrames={1.1}>
								hi
							</Sequence>
						</WrapSequenceContext>
					</CanUseRemotionHooksProvider>
				)
			).toBe(
				'<div style="position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:flex">hi</div>'
			);
		});
		test('It should throw if Sequence has negative duration', () => {
			expectToThrow(
				// @ts-expect-error
				() => render(<Sequence from={0} durationInFrames={-1} />),
				/durationInFrames must be positive, but got -1/
			);
		});
	});

	describe('Throw with invalid from props', () => {
		test('It should throw if "from" props is not a number', () => {
			expectToThrow(
				// @ts-expect-error
				() => render(<Sequence from={'0'} durationInFrames={30} />),
				/You passed to the "from" props of your <Sequence> an argument of type string, but it must be a number./
			);
		});
	});
	test('It should throw for invalid layout value', () => {
		expectToThrow(
			() =>
				render(
					// @ts-expect-error
					<Sequence from={0} durationInFrames={100} layout={'invalid-value'} />
				),
			/The layout prop of <Sequence \/> expects either "absolute-fill" or "none", but you passed: invalid-value/
		);
	});
});

describe('Composition-validation render should NOT throw with valid props', () => {
	test('It should allow null as children', () => {
		expect(() =>
			render(
				<CanUseRemotionHooksProvider>
					<WrapSequenceContext>
						<Sequence durationInFrames={100} from={0}>
							{null}
						</Sequence>
					</WrapSequenceContext>
				</CanUseRemotionHooksProvider>
			)
		).not.toThrow();
	});
	test('It should allow undefined as children', () => {
		expect(() =>
			render(
				<CanUseRemotionHooksProvider>
					<WrapSequenceContext>
						<Sequence durationInFrames={100} from={0}>
							{undefined}
						</Sequence>
					</WrapSequenceContext>
				</CanUseRemotionHooksProvider>
			)
		).not.toThrow();
	});
});
