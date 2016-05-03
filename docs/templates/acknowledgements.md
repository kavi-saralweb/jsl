[index](/docs/jsl/html/index.html)

---

# JSL Acknowledgements

### List 

1.  Structure and Interpretation of Computer Programs, MIT Press, Abelson, Sussman and Sussman
    * https://mitpress.mit.edu/sicp/full-text/book/book.html

2. jsprolog by jan
    * http://ioctl.org/logic/prolog-latest

### Summary

JSL borrows heavily from the reference implementation of a logic programming language in [section 4.4](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-29.html#%_sec_4.4) of the SICP book. The core unification and environment management routines have been ported from Scheme to JS+JSON. The mapping was bound to be imperfect due to the separation of code and data in JS (and JSON). In any case, some features of the textbook implementation were consciously ommitted :

1. Streams : purely a schedule issue, it was easier to do an in-memory recursive implementation, using the jsProlog implementation by jan as a starting point.

1. List processing using the dot(.) operator : a parseList callback is provided instead, along with other wrappers to native JS Array and Object processing facilities.
