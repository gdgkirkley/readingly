import styled from "styled-components";

export const DataTableStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: scroll;
  border: 1px solid ${(props) => props.theme.grey9};
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    overflow-x: hidden;
  }
`;

export const DataTableRow = styled.div`
  vertical-align: middle;
  border-bottom: 1px solid ${(props) => props.theme.grey9};
  transition: 0.2s linear;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(props) => props.theme.grey10};
  }
`;

export const DataTableHeadRow = styled(DataTableRow)`
  min-height: 4rem;
  font-weight: 600;
  &:hover {
    background: none;
  }
`;

export const DataTableCell = styled.div`
  padding: 1.6rem;
  line-height: 2.5rem;
  text-align: left;
  vertical-align: inherit;
  border-right: 1px solid ${(props) => props.theme.grey9};

  &:last-child {
    border-right: none;
  }
`;

// Ignore to preserve color styling
//prettier-ignore
export const DataTableHeadCell = styled(DataTableCell)`

    &.sortable {
        transition: 0.1s linear;

        &:after {
            transition: 0.1s linear;
            content: '🔼';
            opacity: 0;
            margin-left: 0.3rem;
        }

        &:hover {
            color: ${(props) => props.theme.grey8};
            cursor: pointer;

            &:after {
                opacity: 0.1;
            }
        }

        &.sorted {
            &:after {
                opacity: 0;
            }
        }
    }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;

    & div {
      margin-bottom: 1rem;
    }
  }
`;
