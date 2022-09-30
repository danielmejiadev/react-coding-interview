import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Button, PageHeader, Descriptions, Input, message, Modal } from 'antd';

import { withContextInitialized } from '../../components/hoc';
import CompanyCard from '../../components/molecules/CompanyCard';
import GenericList from '../../components/organisms/GenericList';
import OverlaySpinner from '../../components/molecules/OverlaySpinner';
import { usePersonInformation } from '../../components/hooks/usePersonInformation';

import { Company } from '../../constants/types';
import { ResponsiveListCard } from '../../constants';

const PersonDetail = () => {
  const router = useRouter();
  const { load, loading, save, data } = usePersonInformation(
    router.query?.email as string,
    true
  );
  const [editMode, setEditMode] = useState(false);
  const [newData, setNewDate] = useState(data);
  const onFieldChange = (fieldName) => ({ target }) => {
    setNewDate(previous => ({ ...previous, [fieldName]: target.value }))
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <OverlaySpinner title={`Loading ${router.query?.email} information`} />;
  }

  if (!data) {
    message.error("The user doesn't exist redirecting back...", 2, () =>
      router.push('/home')
    );
    return <></>;
  }

  return (
    <> 
      <PageHeader
        onBack={router.back}
        title="Person"
        subTitle="Profile"
        extra={[
          <Button
            style={{ padding: 0, margin: 0 }}
            type="link"
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit website
          </Button>,
          <Button type="default" onClick={() => setEditMode(true)}>
            Edit
          </Button>,
        ]}
      >
        {data && !editMode && (
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
            <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
            <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>

            <Descriptions.Item label="Birthday">{data.birthday}</Descriptions.Item>
          </Descriptions>
        )}
        {editMode && (
          <>
            <Input value={newData.name} onChange={onFieldChange('name')} />
            <Input value={newData.gender} onChange={onFieldChange('gender')} />
            <Input value={newData.phone} onChange={onFieldChange('phone')} />
            <Input value={newData.birthday} onChange={onFieldChange('birthday')} />
            <Button onClick={() => save(newData)}>Save Info</Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </>
        )}
        <GenericList<Company>
          loading={loading}
          extra={ResponsiveListCard}
          data={data && data.companyHistory}
          ItemRenderer={({ item }: any) => <CompanyCard item={item} />}
          handleLoadMore={() => {}}
          hasMore={false}
        />
      </PageHeader>
    </>
  );
};

export default withContextInitialized(PersonDetail);
