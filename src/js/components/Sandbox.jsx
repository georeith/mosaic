import React from 'react';

import PanelContainer from '~/components/PanelContainer.jsx';
import Panel from '~/components/Panel.jsx';
import ImageControls from '~/components/ImageControls.jsx';
import ImageViewer from '~/components/ImageViewer.jsx';

export default function () {
    return (
        <PanelContainer style={{ minHeight: '100%' }}>
            <Panel label="Input">
                <PanelContainer
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'stretch',
                        flexGrow: 1,
                    }}>
                    <ImageControls />
                    <ImageViewer />
                </PanelContainer>
            </Panel>
            <Panel label="Output" />
        </PanelContainer>
    );
}
