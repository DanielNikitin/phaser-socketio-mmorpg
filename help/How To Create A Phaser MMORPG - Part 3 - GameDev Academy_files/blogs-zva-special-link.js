jQuery(document).ready(function(){function zva_special_link_processing(css_class){jQuery('.'+css_class).each(function(){let new_params='utm_source='+zva_special_link.hostname+'&utm_medium=blogs&utm_campaign='+css_class+'&utm_content='+css_class+'_'+window.location.origin+window.location.pathname;let href;if(jQuery(this).is('a')){href=jQuery(this).attr('href');}else if(jQuery(this).closest('a').length){href=jQuery(this).closest('a').attr('href');}else if(jQuery(this).children('a').length){href=jQuery(this).children('a').attr('href');}
if(href){let new_href=href.includes('?')?'&'+new_params:'?'+new_params;if(jQuery(this).is('a')){jQuery(this).attr('href',href+new_href);}else if(jQuery(this).closest('a').length){jQuery(this).closest('a').attr('href',href+new_href);}else if(jQuery(this).children('a').length){jQuery(this).children('a').attr('href',href+new_href);}}});}
zva_special_link_processing('zva_blog_widgets');zva_special_link_processing('zva_blog_topmenu');zva_special_link_processing('zva_blog_footer');zva_special_link_processing('zva_blog_incontent_top');zva_special_link_processing('zva_blog_incontent_btm');});document.addEventListener('DOMContentLoaded',function(){const posts=document.querySelectorAll('.post a[href*="https://academy.zenva.com"]');posts.forEach(link=>{let url=new URL(link.href);if(!url.searchParams.get('utm_campaign')){url.searchParams.set('utm_campaign','article');url.searchParams.set('utm_source',zva_special_link.hostname);url.searchParams.set('utm_medium','blogs');url.searchParams.set('utm_content','article_'+window.location.origin+window.location.pathname);link.href=url.toString();}});});