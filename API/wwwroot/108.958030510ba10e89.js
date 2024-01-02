"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[108],{7108:(O,l,n)=>{n.r(l),n.d(l,{RegisterModule:()=>J});var c=n(6814),p=n(8814),i=n(6223),f=n(5877),m=n(1896),t=n(9212),h=n(6719),v=n(2296),a=n(5195),C=n(9157),F=n(6385),d=n(9038),R=n(841);function y(e,u){if(1&e&&(t.TgZ(0,"mat-list-item")(1,"mat-error"),t._uU(2),t.qZA()()),2&e){const o=u.$implicit;t.xp6(2),t.Oqu(o)}}function b(e,u){if(1&e&&(t.TgZ(0,"mat-list"),t.YNc(1,y,3,1,"mat-list-item",9),t.qZA()),2&e){const o=t.oxw();t.xp6(1),t.Q6J("ngForOf",o.validationErrors)}}const Z=[{path:"",component:(()=>{class e{constructor(o,r,s){this.accountService=o,this.router=r,this.fb=s,this.cancelRegister=new t.vpe,this.registerForm=new i.cw({})}ngOnInit(){this.initializeForm()}initializeForm(){this.registerForm=this.fb.group({userName:["",i.kI.required],password:["",[i.kI.required,i.kI.minLength(6),i.kI.maxLength(12)]],confirmPassword:["",[i.kI.required,this.matchValues("password")]]}),this.registerForm.controls.password.valueChanges.subscribe({next:()=>this.registerForm.controls.confirmPassword.updateValueAndValidity()})}matchValues(o){return r=>r.value===r.parent?.get(o)?.value?null:{notMatching:!0}}register(){this.accountService.register(this.registerForm.value).subscribe({next:()=>{this.router.navigateByUrl("/")},error:r=>{console.log(r.error),this.validationErrors=r.error}})}cancel(){this.cancelRegister.emit(!1),this.router.navigateByUrl("/")}static#t=this.\u0275fac=function(r){return new(r||e)(t.Y36(h.B),t.Y36(m.F0),t.Y36(i.qu))};static#e=this.\u0275cmp=t.Xpm({type:e,selectors:[["app-register"]],outputs:{cancelRegister:"cancelRegister"},decls:21,vars:11,consts:[[1,"flex","m-auto"],[1,"m-auto"],["color","white"],["autocomplete","off",3,"formGroup","ngSubmit"],[1,"mat-mdc-card__input",3,"formControl","label"],[1,"mat-mdc-card__input",3,"formControl","type","label"],[4,"ngIf"],["color","basic","type","button","mat-raised-button","",3,"click"],["color","accent","type","submit","mat-raised-button","",3,"disabled","click"],[4,"ngFor","ngForOf"]],template:function(r,s){1&r&&(t.TgZ(0,"div",0)(1,"div",1)(2,"mat-card")(3,"mat-card-title",2),t._uU(4,"Register here"),t.qZA(),t.TgZ(5,"mat-card-subtitle"),t._uU(6,"Enter your login and password here to register."),t.qZA(),t.TgZ(7,"mat-card-content")(8,"form",3),t.NdJ("ngSubmit",function(){return s.registerForm.valid&&s.register()}),t._UZ(9,"app-input-text",4)(10,"mat-divider")(11,"app-input-text",5)(12,"mat-divider")(13,"app-input-text",5)(14,"mat-divider"),t.qZA(),t.YNc(15,b,2,1,"mat-list",6),t.qZA(),t.TgZ(16,"mat-card-actions")(17,"button",7),t.NdJ("click",function(){return s.cancel()}),t._uU(18,"Cancel"),t.qZA(),t.TgZ(19,"button",8),t.NdJ("click",function(){return s.register()}),t._uU(20,"Register"),t.qZA()()()()()),2&r&&(t.xp6(8),t.Q6J("formGroup",s.registerForm),t.xp6(1),t.Q6J("formControl",s.registerForm.controls.userName)("label","User name"),t.xp6(2),t.Q6J("formControl",s.registerForm.controls.password)("type","password")("label","Password"),t.xp6(2),t.Q6J("formControl",s.registerForm.controls.confirmPassword)("type","password")("label","Confirm password"),t.xp6(2),t.Q6J("ngIf",s.validationErrors),t.xp6(4),t.Q6J("disabled",!s.registerForm.valid))},dependencies:[c.sg,c.O5,i._Y,i.JJ,i.JL,i.oH,i.sg,v.lW,a.a8,a.hq,a.dn,a.$j,a.n5,C.TO,F.d,d.i$,d.Tg,R.m],styles:[".mat-mdc-card[_ngcontent-%COMP%]{max-width:400px;margin:0 auto;text-align:center}.mat-mdc-card[_ngcontent-%COMP%]   .mat-mdc-card__input[_ngcontent-%COMP%]{width:100%}.mat-mdc-card[_ngcontent-%COMP%]   .mdc-card__actions[_ngcontent-%COMP%]{justify-content:space-between}.mat-mdc-card[_ngcontent-%COMP%]   .mat-mdc-list-item[_ngcontent-%COMP%]{height:20px;text-align:left}.mat-mdc-card[_ngcontent-%COMP%]   .mat-mdc-form-field-error[_ngcontent-%COMP%]{font-size:9px}"]})}return e})()}];let x=(()=>{class e{static#t=this.\u0275fac=function(r){return new(r||e)};static#e=this.\u0275mod=t.oAB({type:e});static#r=this.\u0275inj=t.cJS({imports:[m.Bz.forChild(Z),m.Bz]})}return e})(),J=(()=>{class e{static#t=this.\u0275fac=function(r){return new(r||e)};static#e=this.\u0275mod=t.oAB({type:e});static#r=this.\u0275inj=t.cJS({imports:[c.ez,i.u5,i.UX,p.A,f.r,x]})}return e})()}}]);