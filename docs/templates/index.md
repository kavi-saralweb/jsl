# Table of contents

<ul>
[% for page, data in toc %]
[% for heading in data %]
[% if heading.lvl == 1 %]
<li><b><a href="/docs/html/[_ page _].html">[_ heading.content _]</a></b></li>
[% endif %]
[% if heading.lvl == 2 %]
<ul><li><a href="/docs/html/[_ page _].html#[_ heading.slug _]">[_ heading.content _]</a></li></ul>
[% endif %]
[% endfor %]
[% endfor %]
</ul>
