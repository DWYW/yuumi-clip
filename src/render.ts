import { createElement } from './utils/node'

interface Offset {
  left: number;
  top: number;
  width: number;
  height: number;
}

const renderHeader = (file: File|null): HTMLElement => {
  return createElement('header', {
    class: 'yuumi-clip-header'
  }, [
    file ? file.name : ''
  ])
}

const renderFooter = (): HTMLElement => {
  return createElement('footer', {
    class: 'yuumi-clip-footer'
  }, [
    createElement('span', {
      class: 'footer-cancel'
    }, ['取消']),

    createElement('span', {
      class: 'footer-rotate'
    }, ['旋转']),

    createElement('span', {
      class: 'footer-confirm'
    }, ['确认'])
  ])
}

const renderBody = () : HTMLElement => {
  return createElement('div', {
    class: 'yuumi-clip-body'
  }, [
    createElement('div', {
      class: 'clip-body-content'
    }, [
      createElement('div', {
        class: 'clip-wrapper'
      })
    ])
  ])
}

export const renderMain = (file?: File): HTMLElement => {
  return createElement('section', {
    class: ['yuumi-clip']
  }, [
    renderHeader(file),
    renderBody(),
    renderFooter()
  ])
}

export const renderClip = (offset: Offset): HTMLElement => {
  const el = createElement('section', {
    class: 'clip-grid',
    style: {
      left: `${offset.left}px`,
      top: `${offset.top}px`,
      width: `${offset.width}px`,
      height: `${offset.height}px`
    }
  }, [
    createElement('div', {
      class: 'clip-grid-body'
    }, [
      createElement('div', {
        class: 'rect left-top'
      }),

      createElement('div', {
        class: 'rect right-top'
      }),

      createElement('div', {
        class: 'rect right-bottom'
      }),

      createElement('div', {
        class: 'rect left-bottom'
      })
    ])
  ])

  return el
}
