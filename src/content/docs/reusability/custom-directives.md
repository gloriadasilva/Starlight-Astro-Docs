---
title: Custom Directives
description: Learn about Custom directives in Vue js
keywords: Vue, JavaScript, documentation
---
  

  ## Introduction​
  
  In addition to the default set of directives shipped in core (like `v-model` or `v-show`), Vue also allows you to register your own custom directives.

  We have introduced two forms of code reuse in Vue: <a href="https://starlight-astro-docs.vercel.app/getting-started/component-basics/" class="addcolortext"> components</a> and <a href="https://starlight-astro-docs.vercel.app/reusability/composables/" class="addcolortext"> composables</a>. Components are the main building blocks, while composables are focused on reusing stateful logic. Custom directives, on the other hand, are mainly intended for reusing logic that involves low-level DOM access on plain elements.

  A custom directive is defined as an object containing lifecycle hooks similar to those of a component. The hooks receive the element the directive is bound to.
  
  Here is an example of a directive that adds a class to an element when it is inserted into the DOM by Vue:

  ``` javascript
    // vue
    <script setup>
      // enables v-highlight in templates
      const vHighlight = {
      mounted: (el) => {
         el.classList.add('is-highlight')
       }
      }
   </script>

   <template>
     <p v-highlight>This sentence is important!</p>
   </template>
  ```

  <div class="importanttext"> This sentence is important! </div>

  In `<script setup>`, any camelCase variable that starts with the `v` prefix can be used as a custom directive. In the example above, vHighlight can be used in the template as `v-highlight`.

  If you are not using `<script setup>`, custom directives can be registered using the directives option:

  ``` javascript
    // js
    export default {
       setup() {
         /*...*/
        },
      directives: {
       // enables v-highlight in template
       highlight: {
         /* ... */
       }
     }
   }
  ```

  It is also common to globally register custom directives at the app level:

  ``` javascript
    // js
    const app = createApp({})

    // make v-highlight usable in all components
    app.directive('highlight', {
       /* ... */
    })
  ```

  ## When to use custom directives​
  
  Custom directives should only be used when the desired functionality can only be achieved via direct DOM manipulation.

  A common example of this is a `v-focus` custom directive that brings an element into focus.
  
  ``` javascript
    // js
    <script setup>
      // enables v-focus in templates
      const vFocus = {
      mounted: (el) => el.focus()
     }
    </script>

   <template>
      <input v-focus />
   </template>
  ```
  
  This directive is more useful than the `autofocus` attribute because it works not just on page load - it also works when the element is dynamically inserted by Vue!

  Declarative templating with built-in directives such as `v-bind` is recommended when possible because they are more efficient and server-rendering friendly.
  
  ## Directive Hooks​
  
  A directive definition object can provide several hook functions (all optional):
  

  ``` javascript
    // js
    const myDirective = {
    // called before bound element's attributes
    // or event listeners are applied
    created(el, binding, vnode) {
       // see below for details on arguments
   },
   // called right before the element is inserted into the DOM.
   beforeMount(el, binding, vnode) {},
   // called when the bound element's parent component
   // and all its children are mounted.
   mounted(el, binding, vnode) {},
   // called before the parent component is updated
   beforeUpdate(el, binding, vnode, prevVnode) {},
   // called after the parent component and
   // all of its children have updated
   updated(el, binding, vnode, prevVnode) {},
   // called before the parent component is unmounted
   beforeUnmount(el, binding, vnode) {},
   // called when the parent component is unmounted
   unmounted(el, binding, vnode) {}
  }
  ```
  
  ## Hook Arguments
  
  The following arguments are passed to Directive hooks
  
  - `el`: the element the directive is bound to. This can be used to directly manipulate the DOM.

  - `binding`: an object containing the following properties.

    - `value`: The value passed to the directive. For example in v-my-directive="1 + 1", the value would be 2.
    - `oldValue`: The previous value, only available in beforeUpdate and updated. It is available whether or not the value has changed.
    - `arg`: The argument passed to the directive, if any. For example in `v-my-directive:foo`, the arg would be `"foo"`.
    - `modifiers`: An object containing modifiers, if any. For example in `v-my-directive.foo.bar`, the modifiers object would be `{ foo: true, bar: true }`.
    - `instance`: The instance of the component where the directive is used.
    - `dir`: the directive definition object.
  - `vnode`: the underlying VNode representing the bound element.

  - `prevVnode`: the VNode representing the bound element from the previous render. Only available in the beforeUpdate and updated hooks.
  
  As an example, consider the following directive usage:

  ``` javascript
    // template
    <div v-example:foo.bar="baz">
  ```

  The `binding` argument would be an object in the shape of:

  ``` javascript
    // js
    {
      arg: 'foo',
      modifiers: { bar: true },
      value: /* value of `baz` */,
      oldValue: /* value of `baz` from previous update */
    }
  ```

  Similar to built-in directives, custom directive arguments can be dynamic. For example:

  ``` javascript
    // template
    <div v-example:[arg]="value"></div>
  ```

  Here the `directive` argument will be reactively updated based on `arg` property in our component state.

  :::note
    Apart from el, you should treat these arguments as read-only and never modify them. If you need to share information across hooks, it is recommended to do so through element's dataset.

  :::

  ## Function Shorthand​


  It's common for a custom directive to have the same behavior for `mounted` and `updated`, with no need for the other hooks. In such cases we can define the directive as a function:

  ``` javascript
    // template
    <div v-color="color"></div>
  ```

  ``` javascript
    // js
    app.directive('color', (el, binding) => {
      // this will be called for both `mounted` and `updated`
      el.style.color = binding.value
   })
  ```
 
  ## Object Literals​

  If your directive needs multiple values, you can also pass in a JavaScript object literal. Remember, directives can take any valid JavaScript expression.

  ``` javascript
    // template
    <div v-demo="{ color: 'white', text: 'hello!' }"></div>
  ```

  ``` javascript
    // js
    app.directive('demo', (el, binding) => {
      console.log(binding.value.color) // => "white"
      console.log(binding.value.text) // => "hello!"
    })
  ```

  ## Usage on Components

  :::caution[Not Recommended]
    Using custom directives on components is not recommended. Unexpected behaviour may occur when a component has multiple root nodes.
  :::

  When used on components, custom directives will always apply to a component's root node, similar to <a href="https://starlight-astro-docs.vercel.app/component-indepth/fallthrough-attributes/" class="addcolortext"> Fallthrough Attributes</a>.


  ``` javascript
    // template
    <MyComponent v-demo="test" />
  ```

  ``` javascript
    // template
    <!-- template of MyComponent -->

    <div> <!-- v-demo directive will be applied here -->
      <span>My component content</span>
    </div>
  ```

  Note that components can potentially have more than one root node. When applied to a multi-root component, a directive will be ignored and a warning will be thrown. Unlike attributes, directives can't be passed to a different element with `v-bind="$attrs"`.












