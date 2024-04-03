import React, { useEffect } from 'react';
import * as pbi from 'powerbi-client';

const PowerBIReportClient = ({ embedConfig }) => {
  useEffect(() => {
    const embedContainer = document.getElementById('embedContainer');
    const config = {
      type: 'report',
      accessToken: embedConfig.accessToken,
      embedUrl: embedConfig.embedUrl,
      tokenType: pbi.models.TokenType.Embed,
      permissions: pbi.models.Permissions.All,
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
      }
    };

    const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    const report = powerbi.embed(embedContainer, config);

    return () => {
      report.off('loaded');
      report.off('error');
    };
  }, [embedConfig]);

  return <div id="embedContainer" style={{ height: '600px' }}></div>;
};

export default PowerBIReportClient;
