import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloTennis from '../HelloTennis.vue'

describe('HelloTennis', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloTennis, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
