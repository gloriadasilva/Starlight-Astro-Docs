---
title: Component V-model
description: How to use a component V Model
keywords: Vue, JavaScript, documentation
---
  

  ## Basic Usage​
  
  `v-model` can be used on a component to implement a two-way binding.

  Starting in Vue 3.4, the recommended approach to achieve this is using the `defineModel() macro`:

  ``` javascript
    // vue
    <!-- Child.vue -->
      <script setup>
        const model = defineModel()

       function update() {
          model.value++
       }
     </script>

     <template>
        <div>Parent bound v-model is: {{ model }}</div>
        <button @click="update">Increment</button>
     </template>
  ```
  The parent can then bind a value with `v-model`:

  ```javascript
      // template
      <!-- Parent.vue -->
     <Child v-model="countModel" />
  ``` 

  The value returned by `defineModel()` is a ref. It can be accessed and mutated like any other ref, except that it acts as a two-way binding between a parent value and a local one:

  - Its .value is synced with the value bound by the parent v-model;
  - When it is mutated by the child, it causes the parent bound value to be updated as well.

  This means you can also bind this ref to a native input element with `v-model`, making it straightforward to wrap native input elements while providing the same `v-model` usage:
  
  ``` javascript
    // vue
    <script setup>
      const model = defineModel()
    </script>

   <template>
      <input v-model="model" />
   </template>
  ```
  <div class="addcolortext"><a href="https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=" class="addcolortext"> ▶Try it in the playground </a></div>

  ### Under the Hood​
  `defineModel` is a convenience macro. The compiler expands it to the following:

  - A prop named modelValue, which the local ref's value is synced with;
  - An event named update:modelValue, which is emitted when the local ref's value is mutated.
  - This is how you would implement the same child component shown above prior to 3.4:
  
  This is how you would implement the same child component shown above prior to 3.4:

  ``` javascript
    // vue
    <!-- Child.vue -->
      <script setup>
        const props = defineProps(['modelValue'])
        const emit = defineEmits(['update:modelValue'])
      </script>

      <template>
        <input
           :value="props.modelValue"
           @input="emit('update:modelValue', $event.target.value)"
        />
     </template>
  ```

  Then, `v-model="foo"` in the parent component will be compiled to:

  ``` javascript 
    // template
    <!-- Parent.vue -->
      <Child
         :modelValue="foo"
         @update:modelValue="$event => (foo = $event)"
      />
  ```
  
  As you can see, it is quite a bit more verbose. However, it is helpful to understand what is happening under the hood.

  Because `defineModel` declares a prop, you can therefore declare the underlying prop's options by passing it to `defineModel`:

  ``` javascript
    // js
    // making the v-model required
    const model = defineModel({ required: true })

    // providing a default value
   const model = defineModel({ default: 0 })
  ```
  :::caution
    If you have a `default` value for `defineModel` prop and you don't provide any value for this prop from the parent component, it can cause a de-synchronization between parent and child components. In the example below, the parent's `myRef` is undefined, but the child's `model` is 1:

    Child component:

    ``` javascript
      const model = defineModel({ default: 1 })

    ```
    Parent component:

    ``` javascript
      //js
      const myRef = ref()
    ```

    ``` html
    <!-- html -->
      <Child v-model="myRef"></Child>
    ```
  :::
  

  ## `v-model` Arguments​
  
  `v-model` on a component can also accept an argument:

  ``` javascript
    // template
    <MyComponent v-model:title="bookTitle" />
  ```

  In the child component, we can support the corresponding argument by passing a string to `defineModel()` as its first argument:
  
  ``` javascript
    // vue
    <!-- MyComponent.vue -->
      <script setup>
        const title = defineModel('title')
      </script>

      <template>
        <input type="text" v-model="title" />
     </template>
  ```

  <div> <a href="https://play.vuejs.org/#eNqFklFPwjAUhf9K05dhgiyGNzJI1PCgCWqUx77McQeFrW3aOxxZ9t+9LTAXA/q2nnN6+t12Db83ZrSvgE944jIrDTIHWJmZULI02iJrmIWctSy3umQRRaPOWhweNX0pUHiyR3FP870UZkyoTCuH7FPr3VJiAWzqSwfR/rbUKyhYatdV6VugTktTQHQjVBIfeYiEFgikpwi0YizZ3M2aplfXtklMWvD6UKf+CfrUVPBuh+AspngSd718yH+hX7iS4xihjUZYQS4VLPwJgyiI/3FLZSrafzAeBqFG4jgxeuEqGTo6OZfr0dZpRVxNuFWeEa4swL4alEQm+IQFx3tpUeiv56ChrWB41rMNZLsL+tbVXhP8zYIDuyeQzkN6HyBWb88/XgJ3ZxJ95bH/MN/B6aLyjMfYQ6VWhN3LBdqn8FdJtV66eY2g3HkoD+qTbcgLTo/jX+ra6D+449E47BOq5e039mr+gA==" class="addcolortext"> ▶Try it in Playground </a></div>
  
  If prop options are also needed, they should be passed after the model name:

  ``` javascript
    const title = defineModel('title', { required: true })
  ```

  <details>
    <summary>Pre 3.4 Usage</summary>

       
      <!-- MyComponent.vue -->
      <script setup>
        defineProps({
          title: {
            required: true
         }
        })
        defineEmits(['update:title'])
      </script>

      <template>
        <input
         type="text"
         :value="title"
          @input="$emit('update:title', $event.target.value)"
       />
    </template>
  </details>

  ## Multiple v-model Bindings​
  
  
  By leveraging the ability to target a particular prop and event as we learned before with `v-model` arguments, we can now create multiple `v-model` bindings on a single component instance.

  Each `v-model` will sync to a different prop, without the need for extra options in the component:
  
  ``` javascript
    // template
    <UserName
      v-model:first-name="first"
      v-model:last-name="last"
    />
  ```

  ``` javascript
    // vue
    <script setup>
      const firstName = defineModel('firstName')
      const lastName = defineModel('lastName')
    </script>

    <template>
      <input type="text" v-model="firstName" />
      <input type="text" v-model="lastName" />
    </template>
  ```
  
  <div> <a href="https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse" class="addcolortext"> ▶Try it in the Playground</a> </div>

  <details>
    <summary>Pre 3.4 Usage</summary>

       
    <script setup>
      defineProps({
      firstName: String,
      lastName: String
      })

     defineEmits(['update:firstName', 'update:lastName'])
    </script>

    <template>
      <input
        type="text"
        :value="firstName"
        @input="$emit('update:firstName', $event.target.value)"
      />
     <input
       type="text"
        :value="lastName"
       @input="$emit('update:lastName', $event.target.value)"
      />
    </template>
  </details>

  ## Handling `v-model` Modifiers​
  
  When we were learning about form input bindings, we saw that v-model has built-in modifiers - `.trim`, `.number` and `.lazy`. In some cases, you might also want the `v-model` on your custom input component to support custom modifiers.

  Let's create an example custom modifier, `capitalize`, that capitalizes the first letter of the string provided by the `v-model` binding:
  
  ``` javascript
    // template
    <MyComponent v-model.capitalize="myText" />
  ```

  Modifiers added to a component `v-model` can be accessed in the child component by destructuring the `defineModel()` return value like this:
   
  ``` javascript
    // vue
    <script setup>
      const [model, modifiers] = defineModel()

      console.log(modifiers) // { capitalize: true }
    </script>

    <template>
      <input type="text" v-model="model" />
    </template>
  ```
  
  To conditionally adjust how the value should be read / written based on modifiers, we can pass `get` and `set` options to `defineModel()`. These two options receive the value on get / set of the model ref and should return a transformed value. This is how we can use the `set` option to implement the `capitalize` modifier:

  ``` javascript
    // vue
    <script setup>
      const [model, modifiers] = defineModel({
      set(value) {
        if (modifiers.capitalize) {
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
       return value
      }
    })
   </script>

   <template>
     <input type="text" v-model="model" />
   </template>
  ```
  > [▶ Try it in the Playground](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WRIkKksa5N9LybFrFG1OkvgeyccnHsWNc+UuoliIZai9cgQBKbpP0qjWWU9wBI8NnKDxtoUJUycDdH+4tXwzaOgMl/NRLNVlMoA0tTWBoD2scE9wnSoWk8lUmuW8a8rt+EHYOl0R8gtgtVUBlHGRoK6cokqrRwxAW4RGea6mkQg9HGwEboZ+kbKWY027961doy6f86+l6ERIAXNus5wPPcVMvNB+yZOaiZFw/cKYftI/ufEM+FCNQh/+8tRrbJTB+4QUxySWqxa7SkecQn4DqAaKIWekeyAAe0fRG8h5Zb2t/A0VH6Yl2d/Oob+tAhZTeHfGg1Y1Fh/Z6ZR66o5xhRTh8OnyXyy7f6CDSw5S59/Z3WRpOl91lAL70ahN+RCsYT/zFFIk95RG/92RYr+kWPTzSVFpbf9/zTHyEWd9vN5i/e+V+EPYp5gUPzwG9DuUYsCo8htkrQm++/Ut6x5AVh01sy+APzFYHZPGjvY5mjXLHvGy2i95K5TZrMLdntCEfqgkNDuc+VLwkqQNe2v0Z7lX5VX/M+L0BFEuPdc=)

  <details>
    <summary>Pre 3.4 Usage</summary>

       
    <script setup>
      const props = defineProps({
      modelValue: String,
      modelModifiers: { default: () => ({}) }
      })
 
      const emit = defineEmits(['update:modelValue'])

      function emitValue(e) {
        let value = e.target.value
        if (props.modelModifiers.capitalize) {
          value = value.charAt(0).toUpperCase() + value.slice(1)
        }
        emit('update:modelValue', value)
      }
   </script>

   <template>
     <input type="text" :value="props.modelValue" @input="emitValue" />
   </template>
  </details>

  
  ### Modifiers for v-model with Arguments​
  
  Here's another example of using modifiers with multiple v-model with different arguments:

  ``` javascript
    // template
    <UserName
      v-model:first-name.capitalize="first"
      v-model:last-name.uppercase="last"
    />
  ```

  ``` javascript
    // vue
    <script setup>
      const [firstName, firstNameModifiers] = defineModel('firstName')
      const [lastName, lastNameModifiers] = defineModel('lastName')

      console.log(firstNameModifiers) // { capitalize: true }
      console.log(lastNameModifiers) // { uppercase: true }
   </script>
  ```

  <details>
    <summary>Pre 3.4 Usage</summary>

       
    <script setup>
      const props = defineProps({
      firstName: String,
      lastName: String,
      firstNameModifiers: { default: () => ({}) },
      lastNameModifiers: { default: () => ({}) }
      })
      defineEmits(['update:firstName', 'update:lastName'])

     console.log(props.firstNameModifiers) // { capitalize: true }
     console.log(props.lastNameModifiers) // { uppercase: true }
    </script>
  </details>
