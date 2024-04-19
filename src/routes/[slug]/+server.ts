import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import SpaceMono from '$lib/SpaceMono-Bold.ttf';
import { read } from '$app/server';
import { page } from '$app/stores';

const fontData = read(SpaceMono).arrayBuffer();

/** @type {import('./$types').RequestHandler} */
export const GET = async (request) => {
	const dimensions = request.url.pathname.replaceAll('/', '').split('x');
	const width = parseInt(dimensions[0]);
	const height = parseInt(dimensions[1]);

	const html = {
		type: 'div',
		props: {
			children: 'PLACEHOLDER',
			style: {
				height: `${height}px`,
				width: `${width}px`,
				color: 'black',
				textAlign: 'center',
				textWrap: 'wrap',
				fontSize: `${width / 10}px`,
				padding: `${width / 10}`
			}
		}
	};
	const svg = await satori(html, {
		height: height, // Include the height property here
		fonts: [
			{
				name: 'Space Mono',
				data: await fontData,
				style: 'normal'
			}
		]
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
