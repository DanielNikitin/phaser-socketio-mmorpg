jQuery(document).ready(function(jQuery){class RmpMenu{constructor(options){RmpMenu.activeToggleClass='is-active';RmpMenu.openContainerClass='rmp-menu-open';RmpMenu.activeSubMenuArrowClass='rmp-menu-subarrow-active';RmpMenu.subMenuClass='.rmp-submenu';RmpMenu.activeTopMenuClass='rmp-topmenu-active';this.options=options;this.menuId=this.options['menu_id'];this.trigger='#rmp_menu_trigger-'+this.menuId;this.isOpen=false;this.container='#rmp-container-'+this.menuId;this.headerBar='#rmp-header-bar-'+this.menuId;this.menuWrap='ul#rmp-menu-'+this.menuId;this.subMenuArrow='.rmp-menu-subarrow';this.wrapper='.rmp-container';this.linkElement='.rmp-menu-item-link';this.pageWrapper=this.options['page_wrapper'];this.use_desktop_menu=this.options['use_desktop_menu'];this.originalHeight='',this.animationSpeed=this.options['animation_speed']*1000;this.hamburgerBreakpoint=this.options['tablet_breakpoint'];this.subMenuTransitionTime=this.options['sub_menu_speed']*1000;if(this.options['button_click_trigger'].length>0){this.trigger=this.trigger+' , '+this.options['button_click_trigger'];}
if(this.options['button_position_type']=='inside-element'){var destination=jQuery(this.trigger).attr('data-destination');jQuery(this.trigger).appendTo(jQuery(destination).parent());}
this.init();}
init(){const self=this;jQuery(this.trigger).on('click',function(e){e.stopPropagation();self.triggerMenu();});jQuery(self.menuWrap).find(self.subMenuArrow).on('click',function(e){e.preventDefault();e.stopPropagation();self.triggerSubArrow(this);});if('on'==self.options['menu_close_on_body_click']){jQuery(document).on('click','body',function(e){if(jQuery(window).width()<self.hamburgerBreakpoint){if(self.isOpen){if(jQuery(e.target).closest(self.container).length||jQuery(e.target).closest(self.target).length){return;}}
self.closeMenu();}});}
if(self.options['menu_close_on_link_click']=='on'){jQuery(this.menuWrap+' '+self.linkElement).on('click',function(e){if(jQuery(window).width()<self.hamburgerBreakpoint){e.preventDefault();if(self.options['menu_item_click_to_trigger_submenu']=='on'){if(jQuery(this).is('.rmp-menu-item-has-children > '+self.linkElement)){return;}}
let _href=jQuery(this).attr('href');let _target=(typeof jQuery(this).attr('target'))=='undefined'?'_self':jQuery(this).attr('target');if(self.isOpen){if(jQuery(e.target).closest(this.subMenuArrow).length){return;}
if(typeof _href!='undefined'){self.closeMenu();setTimeout(function(){window.open(_href,_target);},self.animationSpeed);}}}});}
if('on'==self.options['menu_item_click_to_trigger_submenu']){jQuery(this.menuWrap+' .rmp-menu-item-has-children > '+self.linkElement).on('click',function(e){if(jQuery(window).width()<self.hamburgerBreakpoint){e.preventDefault();self.triggerSubArrow(jQuery(this).children('.rmp-menu-subarrow').first());}});}}
setWrapperTranslate(){let translate,translateContainer;switch(this.options['menu_appear_from']){case 'left':translate='translateX('+this.menuWidth()+'px)';translateContainer='translateX(-'+this.menuWidth()+'px)';break;case 'right':translate='translateX(-'+this.menuWidth()+'px)';translateContainer='translateX('+this.menuWidth()+'px)';break;case 'top':translate='translateY('+this.wrapperHeight()+'px)';translateContainer='translateY(-'+this.menuHeight()+'px)';break;case 'bottom':translate='translateY(-'+this.menuHeight()+'px)';translateContainer='translateY('+this.menuHeight()+'px)';break;}
if(this.options['animation_type']=='push'){jQuery(this.pageWrapper).css({'transform':translate});if('body'==this.pageWrapper){jQuery(this.container).css({'transform':translateContainer});}}
if(this.options['button_push_with_animation']=='on'){jQuery(this.trigger).css({'transform':translate});}}
clearWrapperTranslate(){if(this.options['animation_type']=='push'){jQuery(this.pageWrapper).css({'transform':''});}
if(this.options['button_push_with_animation']=='on'){jQuery(this.trigger).css({'transform':''});}}
fadeMenuIn(){jQuery(this.container).fadeIn(this.animationSpeed);}
fadeMenuOut(){jQuery(this.container).fadeOut(this.animationSpeed,function(){jQuery(this).css('display','');});}
openMenu(){var self=this;jQuery(this.trigger).addClass(RmpMenu.activeToggleClass);jQuery(this.container).addClass(RmpMenu.openContainerClass);if(this.options['animation_type']=='fade'){this.fadeMenuIn();}else{this.setWrapperTranslate();}
this.isOpen=true;}
closeMenu(){jQuery(this.trigger).removeClass(RmpMenu.activeToggleClass);jQuery(this.container).removeClass(RmpMenu.openContainerClass);if(this.options['animation_type']=='fade'){this.fadeMenuOut();}else{this.clearWrapperTranslate();}
this.isOpen=false;}
triggerMenu(){this.isOpen?this.closeMenu():this.openMenu();}
triggerSubArrow(subArrow){var self=this;var sub_menu=jQuery(subArrow).parent().siblings(RmpMenu.subMenuClass);if(self.options['accordion_animation']=='on'){var top_siblings=sub_menu.parents('.rmp-menu-item-has-children').last().siblings('.rmp-menu-item-has-children');var first_siblings=sub_menu.parents('.rmp-menu-item-has-children').first().siblings('.rmp-menu-item-has-children');top_siblings.children('.rmp-submenu').slideUp(self.subMenuTransitionTime,'linear').removeClass('rmp-submenu-open');top_siblings.each(function(){jQuery(this).find(self.subMenuArrow).first().html(self.options['inactive_toggle_contents']);jQuery(this).find(self.subMenuArrow).first().removeClass(RmpMenu.activeSubMenuArrowClass);jQuery(this).removeClass(RmpMenu.activeTopMenuClass);});first_siblings.children('.rmp-submenu').slideUp(self.subMenuTransitionTime,'linear').removeClass('rmp-submenu-open');first_siblings.each(function(){jQuery(this).find(self.subMenuArrow).first().html(self.options['inactive_toggle_contents']);jQuery(this).find(self.subMenuArrow).first().removeClass(RmpMenu.activeSubMenuArrowClass);jQuery(this).removeClass(RmpMenu.activeTopMenuClass);});}
if(sub_menu.hasClass('rmp-submenu-open')){sub_menu.slideUp(self.subMenuTransitionTime,'linear',function(){jQuery(this).css('display','');}).removeClass('rmp-submenu-open');jQuery(subArrow).html(self.options['inactive_toggle_contents']);jQuery(subArrow).removeClass(RmpMenu.activeSubMenuArrowClass);jQuery(subArrow).closest('.rmp-menu-item-has-children').removeClass(RmpMenu.activeTopMenuClass);}else{sub_menu.slideDown(self.subMenuTransitionTime,'linear').addClass('rmp-submenu-open');jQuery(subArrow).html(self.options['active_toggle_contents']);jQuery(subArrow).addClass(RmpMenu.activeSubMenuArrowClass);jQuery(subArrow).closest('.rmp-menu-item-has-children').addClass(RmpMenu.activeTopMenuClass);}}
pushMenuTrigger(e){if('on'==this.options['button_push_with_animation']){jQuery(this.trigger).css({'transform':this.menuWidth()});}}
menuHeight(){return jQuery(this.container).height();}
menuWidth(){return jQuery(this.container).width();}
wrapperHeight(){return jQuery(this.wrapper).height();}
backUpSlide(backButton){let translateTo=parseInt(jQuery(this.menuWrap)[0].style.transform.replace(/^\D+/g,''))-100;jQuery(this.menuWrap).css({'transform':'translateX(-'+translateTo+'%)'});let previousSubmenuHeight=jQuery(backButton).parent('ul').parent('li').parent('.rmp-submenu').height();if(!previousSubmenuHeight){jQuery(this.menuWrap).css({'height':this.originalHeight});}else{jQuery(this.menuWrap+this.menuId).css({'height':previousSubmenuHeight+'px'});}}}
for(let index=0;index<rmp_menu.menu.length;index++){let rmp=new RmpMenu(rmp_menu.menu[index]);}});