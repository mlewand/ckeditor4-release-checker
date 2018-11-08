'use strict';

const version = '4.11.1',
	hash = 'c264cacc9d10a61ab83a299eac58c6976e48d97d', // ckeditor-dev revision
	shortVersion = version.replace( /\.0$/, '' ),
	fetch = require( 'node-fetch' ),
	expect = require( 'chai' ).expect,
	github = require( 'github-api' );

const gh = new github();

describe( 'CKEditor4 dev version', () => {
	describe( 'ckeditor/ckeditor-dev repo', () => {
		it( 'has a tag', () => {
			return fetch( `https://github.com/ckeditor/ckeditor-dev/tree/${version}` )
				.then( res => {
					expect( res.status, 'Response code' ).to.be.eql( 200 );
				} );
		} );

		it( 'tag has correct hash', () => {
			let repo = gh.getRepo( 'ckeditor', 'ckeditor-dev' );

			return repo.listTags()
				.then( tags => {
					tags = tags.data;
					tags = tags.filter( tag => tag.name == version );

					expect( tags.length, 'Matched tags count' ).to.be.eql( 1 );

					expect( tags[ 0 ].commit.sha, 'Commit SHA' ).to.be.eql( hash );
				} );
		} );
	} );
} );

describe( 'CKEditor4 presets', () => {
	describe( 'ckeditor/ckeditor-presets repo', () => {
		it( 'has a tag', () => {
			return fetch( `https://github.com/ckeditor/ckeditor-presets/tree/${version}` )
				.then( res => {
					expect( res.status, 'Response code' ).to.be.eql( 200 );
				} );
		} );

		it( 'ckeditor submodule has a correct hash', () => {
			let repo = gh.getRepo( 'ckeditor', 'ckeditor-presets' );

			return repo.getContents( version, 'ckeditor' )
				.then( content => {
					expect( content.data.sha ).to.be.eql( hash );
				} );
		} );
	} );
} );

describe( 'CKEditor4 SDK', function() {
	this.timeout( 5000 );

	it( 'has a correct CKEditor verison', () => {
		return fetch( 'http://sdk.ckeditor.com/vendor/ckeditor/ckeditor.js' )
			.then( res => {
				expect( res.status, 'Response code' ).to.be.eql( 200 );
				return res.text();
			} )
			.then( js => {
				let actualVersionRegExp = /,version:\"(\d+\.\d+\.\d+) /,
					res = String( js ).match( actualVersionRegExp );

				expect( res ).to.be.an( 'array' );
				expect( res[ 1 ] ).to.be.eql( version );
			} );
	} );
} );

describe( 'CKEditor4 cdn', function() {
	this.timeout( 20000 );

	let presets = [ 'basic', 'standard', 'standard-all', 'full', 'full-all' ];

	for ( let preset of presets ) {
		it( `has a correct CKEditor version for ${preset}`, () => {
			return fetch( `https://cdn.ckeditor.com/${version}/${preset}/ckeditor.js` )
				.then( res => {
					expect( res.status, `Response code for ${preset}` ).to.be.eql( 200 );
					return res.text();
				} )
				.then( js => {
					let actualVersionRegExp = /,version:\"(\d+\.\d+\.\d+)/,
						res = String( js ).match( actualVersionRegExp );

					expect( res, preset ).to.be.an( 'array' );
					expect( res[ 1 ], preset ).to.be.eql( version );
				} );
		} );
	}
} );

describe( 'ckeditor.com', () => {
	it( 'has a correct CKEditor version', () => {
		return fetch( 'http://ckeditor.com/ckeditor-4/' )
			.then( res => {
				expect( res.status, 'Response code' ).to.be.eql( 200 );
				return res.text();
			} )
			.then( html => {
				let actualVersionRegExp = /\/assets\/libs\/ckeditor4\/(\d+\.\d+\.\d+)\/ckeditor\.js/,
					res = String( html ).match( actualVersionRegExp );

				expect( res ).to.be.an( 'array' );
				expect( res[ 1 ] ).to.be.eql( version );
			} );
	} );

	it( 'has a blog post', () => {
		return fetch( `http://ckeditor.com/blog/CKEditor-${shortVersion}-released` )
			.then( res => {
				expect( res.status, 'Response code' ).to.be.eql( 200 );
			} );
	} );
} );