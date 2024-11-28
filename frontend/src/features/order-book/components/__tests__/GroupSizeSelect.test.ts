import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GroupSizeSelect from '../GroupSizeSelect.vue'
import type { GroupSize } from '../../types'

describe('GroupSizeSelect', () => {
  const options: GroupSize[] = [0.5, 1, 2.5, 5, 10, 25, 50, 100]

  it('renders all group size options', () => {
    const wrapper = mount(GroupSizeSelect, {
      props: {
        modelValue: 0.5,
        options,
      },
    })

    const optionElements = wrapper.findAll('option')
    expect(optionElements).toHaveLength(options.length)
    expect(optionElements[0].text()).toBe('Group 0.5')
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = mount(GroupSizeSelect, {
      props: {
        modelValue: 0.5,
        options,
      },
    })

    await wrapper.find('select').setValue('1')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('displays the current value', () => {
    const wrapper = mount(GroupSizeSelect, {
      props: {
        modelValue: 2.5,
        options,
      },
    })

    expect(wrapper.find('select').element.value).toBe('2.5')
  })
})
