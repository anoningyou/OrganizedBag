"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[257],{1257:(F,h,i)=>{i.r(h),i.d(h,{SharedModule:()=>M});var u=i(6814),p=i(1896),c=i(7398),v=i(1647),r=i(9212),y=i(2425),f=i(5619),g=i(8180),l=i(1474),C=i(4826);let m=(()=>{class e extends C.q{constructor(t){super(t,"shared")}getComplect(t){const s=(new l.LE).set("id",t);return this.http.get(`${this.rootUrl}getComplect`,{params:s})}static#t=this.\u0275fac=function(s){return new(s||e)(r.LFG(l.eN))};static#e=this.\u0275prov=r.Yz7({token:e,factory:e.\u0275fac})}return e})(),d=(()=>{class e{constructor(t){this.sharedHttpService=t,this.complectSource=new f.X(null),this.complect$=this.complectSource.asObservable()}loadComplect(t){return this.sharedHttpService.getComplect(t).pipe((0,c.U)(s=>(this.complectSource.next(s),s)))}clearComplect(){this.complectSource.next(null)}updatePropertyParam(t){this.resetPropertyParams([t])}updatePropertyParams(t){this.resetPropertyParams(t)}resetPropertyParams(t){this.complect$.pipe((0,g.q)(1)).subscribe(s=>{t.forEach(o=>{const a=s?.properties.find(n=>n.id===o.propertyId);a&&(a.params=o)}),this.complectSource.next(s)})}static#t=this.\u0275fac=function(s){return new(s||e)(r.LFG(m))};static#e=this.\u0275prov=r.Yz7({token:e,factory:e.\u0275fac})}return e})();var P=i(8685);const S=[{path:":id",component:(()=>{class e{constructor(t,s,o){this.activatedRoute=t,this.toastr=s,this.sharedService=o,this.isMobile=!1,this.subscriptions=[],this.complect$=this.sharedService.complect$.pipe((0,c.U)(a=>a?.complect??null)),this.properties$=this.sharedService.complect$.pipe((0,c.U)(a=>a?.properties??null)),this.items$=this.sharedService.complect$.pipe((0,c.U)(a=>a?.items&&a.properties?a.items.map(n=>v.O.getItem(n,a.properties)):null))}ngOnInit(){const t=this.activatedRoute.paramMap.subscribe(s=>{const o=s.get("id");o?this.subscriptions.push(this.sharedService.loadComplect(o).subscribe(a=>{})):(this.toastr.error("Id is undefined"),this.sharedService.clearComplect())});this.subscriptions.push(t)}ngOnDestroy(){this.subscriptions.forEach(t=>{t&&t.unsubscribe()})}onCurrentCategoryChange(t){}onPropertyParamChange(t){this.sharedService.updatePropertyParam(t)}onPropertyParamsChange(t){this.sharedService.updatePropertyParams(t)}static#t=this.\u0275fac=function(s){return new(s||e)(r.Y36(p.gz),r.Y36(y._W),r.Y36(d))};static#e=this.\u0275cmp=r.Xpm({type:e,selectors:[["app-shared"]],decls:3,vars:8,consts:[[1,"shared"],["shared",""],[1,"block","complect-items","active",3,"isMobile","isActive","complect$","items$","properties$","isReadonly","propertyParamsChange","propertyParamChange"]],template:function(s,o){1&s&&(r.TgZ(0,"section",0,1)(2,"app-complect-items",2),r.NdJ("propertyParamsChange",function(n){return o.onPropertyParamsChange(n)})("propertyParamChange",function(n){return o.onPropertyParamChange(n)}),r.qZA()()),2&s&&(r.ekj("mobile",o.isMobile),r.xp6(2),r.Q6J("isMobile",o.isMobile)("isActive",!0)("complect$",o.complect$)("items$",o.items$)("properties$",o.properties$)("isReadonly",!0))},dependencies:[P.J],styles:[".shared[_ngcontent-%COMP%]{display:flex;justify-content:stretch;align-items:stretch;width:100%;height:100%;gap:5px;padding:5px}.shared[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{flex:1 0 auto;height:100%;width:100%}"]})}return e})()}];let $=(()=>{class e{static#t=this.\u0275fac=function(s){return new(s||e)};static#e=this.\u0275mod=r.oAB({type:e});static#s=this.\u0275inj=r.cJS({imports:[p.Bz.forChild(S),p.Bz]})}return e})();var b=i(1658);let M=(()=>{class e{static#t=this.\u0275fac=function(s){return new(s||e)};static#e=this.\u0275mod=r.oAB({type:e});static#s=this.\u0275inj=r.cJS({providers:[m,d],imports:[u.ez,$,b.C]})}return e})()}}]);