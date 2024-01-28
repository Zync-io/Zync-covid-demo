import { space } from '~/style/theme';
import { Box } from '../base/box';
import { Heading } from '../typography';
import { ContactPageGroupItem } from './contact-page-item';
import { PageGroup } from './types';

interface ContactPageGroupProps {
  groups: PageGroup[];
}

export const ContactPageGroup = ({ groups }: ContactPageGroupProps) => {
  return (
    <Box as="section" flexBasis="half">
      {groups.map(({ id, title, items }) => (
        <div key={id} className="group-container">
          <Heading marginBottom={space[3]} level={2}>
            {title}
          </Heading>

          {items.map((first, second) => (
            <ContactPageGroupItem key={first.id} item={first} index={second} groupItemsLength={items.length} />
          ))}
        </div>
      ))}
    </Box>
  );
};