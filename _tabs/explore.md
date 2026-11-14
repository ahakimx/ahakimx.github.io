---
layout: page
title: Explore
icon: fas fa-compass
order: 0
---

Find a post by topic, tag, language, year, or title. This page replaces the separate Categories, Tags, and Archives menus.

<!-- Saringan di bawah dibuat assets/js/lab.js dari daftar post ini (tanpa JavaScript, daftarnya tetap tampil urut waktu). -->
<div id="explore-ui" class="explore"></div>

<ul class="explore__list" id="explore-list">
{% for p in site.posts %}<li data-year="{{ p.date | date: '%Y' }}" data-lang="{{ p.lang | default: 'en' }}" data-cats="{{ p.categories | join: '|' | escape }}" data-tags="{{ p.tags | join: '|' | escape }}"><time datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: '%b %-d, %Y' }}</time><a href="{{ p.url | relative_url }}">{{ p.title | escape }}</a><span class="proj-lang">{% if p.lang == 'id' %}ID{% else %}EN{% endif %}</span></li>
{% endfor %}</ul>

<p class="explore__old">The classic pages are still available: <a href="{{ '/categories/' | relative_url }}">Categories</a> · <a href="{{ '/tags/' | relative_url }}">Tags</a> · <a href="{{ '/archives/' | relative_url }}">Archives</a></p>
