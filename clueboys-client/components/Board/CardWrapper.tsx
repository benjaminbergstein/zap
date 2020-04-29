import styled from 'styled-components'

interface WrapperProps {
  position: string
}

const Wrapper = styled.div`
  order: ${(props: WrapperProps) => props.position};
  flex-basis: 20%;
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
`

export default Wrapper
