import{j as e,z as m,r as c,u as p,aS as b}from"./main-BzcHl3pj.js";import{B as u}from"./Breadcrumb-BFqYMCbo.js";import{c as i}from"./createReactComponent-DqxYMQ7o.js";import{S as g,s as y}from"./SocialLinkModal-DrY8DS1e.js";import{E as v}from"./EditorEntityListSection-BXOfrJpY.js";import{E as x,a as f}from"./EditorPageShell-HkHVo7dd.js";import"./EditorSection-DYaiN6cx.js";/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3",key:"svg-0"}]],M=i("outline","brand-facebook","BrandFacebook",N);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8",key:"svg-0"}],["path",{d:"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",key:"svg-1"}],["path",{d:"M16.5 7.5v.01",key:"svg-2"}]],_=i("outline","brand-instagram","BrandInstagram",j);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M8 11v5",key:"svg-0"}],["path",{d:"M8 8v.01",key:"svg-1"}],["path",{d:"M12 16v-5",key:"svg-2"}],["path",{d:"M16 16v-3a2 2 0 1 0 -4 0",key:"svg-3"}],["path",{d:"M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10",key:"svg-4"}]],w=i("outline","brand-linkedin","BrandLinkedin",L);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917",key:"svg-0"}]],E=i("outline","brand-tiktok","BrandTiktok",I);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M4 4l11.733 16h4.267l-11.733 -16l-4.267 0",key:"svg-0"}],["path",{d:"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772",key:"svg-1"}]],S=i("outline","brand-x","BrandX",F);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8",key:"svg-0"}],["path",{d:"M10 9l5 3l-5 3l0 -6",key:"svg-1"}]],T=i("outline","brand-youtube","BrandYoutube",B);/**
 * @license @tabler/icons-react v3.44.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"M9 15l6 -6",key:"svg-0"}],["path",{d:"M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464",key:"svg-1"}],["path",{d:"M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463",key:"svg-2"}]],O=i("outline","link","Link",A),d={facebook:{icon:M,className:"bg-[#1877F2]/10 text-[#1877F2]",label:"Facebook"},instagram:{icon:_,className:"bg-[#E4405F]/10 text-[#E4405F]",label:"Instagram"},tiktok:{icon:E,className:"bg-black/5 text-black dark:bg-white/10 dark:text-white",label:"TikTok"},linkedin:{icon:w,className:"bg-[#0A66C2]/10 text-[#0A66C2]",label:"LinkedIn"},twitter:{icon:S,className:"bg-black/5 text-black dark:bg-white/10 dark:text-white",label:"Twitter / X"},youtube:{icon:T,className:"bg-[#FF0000]/10 text-[#FF0000]",label:"YouTube"},other:{icon:O,className:"bg-primary/10 text-primary",label:"Other"}},$=a=>{var o;return((o=d[a])==null?void 0:o.label)||a.charAt(0).toUpperCase()+a.slice(1).replace("_"," ")},C=({platform:a,size:o=22,showLabel:n=!1,className:l=""})=>{const s=d[a]||d.other,r=s.icon;return e.jsxs("div",{className:`flex items-center gap-3 ${l}`,children:[e.jsx("div",{className:`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.className}`,children:e.jsx(r,{size:o,stroke:1.5})}),n&&e.jsx("span",{className:"font-semibold text-gray-900 dark:text-white",children:s.label})]})},X=()=>{const a=m(),[o,n]=c.useState(!1),[l,s]=c.useState(null),{data:r,isLoading:h}=p({queryKey:["editor-social-links"],queryFn:()=>y.getAll({per_page:100,sort_by:"sort_order",sort_direction:"asc"})}),k=()=>{a.invalidateQueries({queryKey:["editor-social-links"]}),a.invalidateQueries({queryKey:["Social Link Table"]})};return e.jsxs(e.Fragment,{children:[e.jsx(u,{items:[{title:"Dashboard",path:"/dashboard"},{title:"Website Editor",path:"/editor"},{title:"Site-wide",path:"/editor/site-wide"},{title:"Social media links"}]}),e.jsxs(x,{title:"Social media links",subtitle:"Add links to your Facebook, Instagram, TikTok, LinkedIn, and other profiles.",icon:b,tip:e.jsx(e.Fragment,{children:"These links appear in your website footer and anywhere visitors can follow you online. Only active links are shown on the site."}),children:[e.jsx(v,{title:"Your social profiles",description:"One card per platform — pick the network and paste the full profile URL.",items:(r==null?void 0:r.data)||[],isLoading:h,emptyMessage:"No social links added yet.",emptyHint:"Start with the platforms you use most, like Facebook or Instagram.",onAdd:()=>{s(null),n(!0)},onEdit:t=>{s(t),n(!0)},addLabel:"Add social link",editLabel:"Edit link",renderItem:t=>e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(C,{platform:t.platform}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"font-semibold text-gray-900 dark:text-white",children:$(t.platform)}),e.jsx("p",{className:"mt-1 truncate text-sm text-primary",children:t.url}),!t.is_active&&e.jsx("p",{className:"mt-1 text-xs text-danger",children:"Hidden on website"})]})]})}),e.jsxs(f,{variant:"info",children:["When you're done, use the sidebar to return to"," ",e.jsx("strong",{children:"Website Editor"}),"."]})]}),e.jsx(g,{isOpen:o,setIsOpen:t=>{n(t),t||(s(null),k())},socialLinkToEdit:l})]})};export{X as default};
