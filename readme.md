# Case Split

Algebraic data types, e.g. tagged sum and product types, have very
simple representations as Javascript objects.

Plain old Javascript objects are often tagged products.  Specific keys
must be present on an object, and their values must be of certain
types.  Property access is how values of product types are used.
Given most objects, you access any of its properties to obtain a
corresponding value.

Tagged sums are also easily represented easily using Javascript
objects.  These are single-property objects, where the one property is
chosen from a given set.  Case splitting, not property access, is how
sum types are used.  To case split on an object, you provide one
function for each possible key.

## casesplit

The code for the `casesplit` function loops through the keys of the
sum type - of which there should be one.  It indexes into the set of
cases using that key and applies the function to the object value.

```
var casesplit = function (cases) {
	return function (obj) {
		for (var key in obj) {
			if (cases.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
				if (!isFunction(cases[key])) {
					return cases[key];
				}
				return cases[key](obj[key]);
			}
		}
		throw 'no case for ' + JSON.stringify(obj);
	};
};
```

## Install

In case you don't want to copy and paste the above function, you can
install `casesplit` using npm or bower.

`npm install casesplit`

`bower install casesplit`

Source code is at https://github.com/jeffersoncarpenter/casesplit.

## Example - Blog Posts

Sum types can be helpful when you have multiple different kinds of
things that you want to condense down into a list of one kind of
thing.

As a slightly contrived example, consider a blog with several post
types: text, image, and video.  We will say that a text post has a
body, an image has a src and a caption, and a video has a src and a
caption.  The only difference is that they must be rendered slightly
differently.

Informally, here's the type of blog posts.  `AND` and `OR` refer to
product and sum types:

```
type Post = OR({
    text: AND({
        body: String,
    }),
    image: AND({
        src: String,
        caption: String,
    }),
    video: AND({
        src: String,
        caption: String,
    }),
});
```

Here is some sample data that we might want to display on this blog.

```
var textPost1 = {
    text: {
        body: 'Hello World',
    }
};

var textPost2 = {
    text: {
        body: 'Second Post',
    }
};

var imagePost = {
    image: {
        src: './image.png',
        caption: 'Us At The Wedding',
    }
};

var posts = [
    textPost1,
    textPost2,
    imagePost,
];
```

Now, the render method might look like this, providing a code path for
each possible post type (using hyperscript notation for html):


```
var caseSplit = require('casesplit');

var renderPost = caseSplit({
    text: function (post) {
        return h('p', post.body);
    },
    image: function (post) {
        return h('div', [
            h('img', {
                src: post.src,
            }),
            h('p', post.caption),
        ]);
    },
    video: function (post) {
        return h('div', [
            h('iframe', {
                src: post.src,
            }),
            h('p', post.caption),
        ]);
    },
});
```

## Example - Lambda Term Evaluator

To show recursion, here is a lambda term evaluator.

Informally, here is the type of lambda terms:

```
type Term = OR({
    identifier: String,
    lambda: AND({
        arg: String,
        expression: Term,
    }),
    apply: AND({
        func: Term,
        value: Term,
    }),
});
```

As a very simple example, here is the identity function:

```
var identity = {
    lambda: {
        arg: 'a',
        expression: {
            identifier: 'a'
        },
    }
};
```

And here is the evaluator.

```
var caseSplit = require('casesplit');

var evaluateTermWithContext = function (context) {
    return caseSplit({
        var: function (name) {
            return context[name];
        },
        lambda: function (obj) {
            return {
                arg: obj.arg,
                expression: evaluateTermWithContext(context)(obj.expression),
            };
        },
        apply: function (obj) {
            context = Object.clone(context); // clone the context
            context[obj.func.var] = obj.val;
            return evalTermWithContext(context)(obj.func.expr);
        },
    });
};

var evaluateTerm = evaluateTermWithContext({});
```
