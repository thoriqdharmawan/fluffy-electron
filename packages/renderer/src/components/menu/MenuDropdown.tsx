import { Menu, MenuItemProps } from '@mantine/core';

interface MenuSections {
  label?: string;
  items: MenuItemProps[];
}

interface Props {
  children: React.ReactNode;
  sections: MenuSections[];
}

export default function MenuDropdown({ children, sections }: Props) {
  const totalSections = sections.length;

  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        {sections?.map((section, id) => {
          return (
            <div key={id}>
              {section.label && (<Menu.Label>{section.label}</Menu.Label>)}
              {section.items.map((item: MenuItemProps, id) => {
                return <Menu.Item {...item} key={id} />;
              })}
              {id + 1 !== totalSections && <Menu.Divider />}
            </div>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
