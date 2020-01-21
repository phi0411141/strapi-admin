/**
 *
 * LeftMenuLinkContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, snakeCase, isEmpty, map, sortBy } from 'lodash';
import { auth } from 'strapi-helper-plugin';

import LeftMenuLink from '../LeftMenuLink';
import Wrapper from './Wrapper';
import messages from './messages.json';
import { ADMIN_ROLE } from '../../config';

function LeftMenuLinkContainer({ plugins, ...rest }) {
  // Generate the list of sections
  console.log(plugins);
  const pluginsSections = Object.keys(plugins).reduce((acc, current) => {
    plugins[current].leftMenuSections.forEach((section = {}) => {
      if (!isEmpty(section.links)) {
        acc[snakeCase(section.name)] = {
          name: section.name,
          links: get(acc[snakeCase(section.name)], 'links', []).concat(
            section.links
              .filter(link => link.isDisplayed !== false)
              .map(link => {
                link.plugin = !isEmpty(plugins[link.plugin])
                  ? link.plugin
                  : plugins[current].id;

                return link;
              })
          ),
        };
      }
    });

    return acc;
  }, {});

  const linkSections = Object.keys(pluginsSections).map((current, j) => {
    const contentTypes = pluginsSections[current].links;

    return (
      <div key={j}>
        <p className="title">
          <FormattedMessage {...messages.contentTypes}>
            {title => title}
          </FormattedMessage>
        </p>
        <ul className="list  models-list">
          {sortBy(contentTypes, 'label').map((link, i) => (
            <LeftMenuLink
              {...rest}
              key={`${i}-${link.label}`}
              icon={link.icon || 'circle'}
              label={link.label}
              destination={`/plugins/${link.plugin}/${link.destination ||
                link.uid}`}
            />
          ))}
        </ul>
      </div>
    );
  });

  // Check if the plugins list is empty or not and display plugins by name
  const pluginsLinks = !isEmpty(plugins) ? (
    map(sortBy(plugins, 'name'), plugin => {
      if (plugin.id === 'user-permissions' && get(auth.getUserInfo(), 'admin_layout') !== ADMIN_ROLE.ADMIN) {
        return null
      }

      if (plugin.id !== 'email' && plugin.id !== 'content-manager') {

        const pluginSuffixUrl = plugin.suffixUrl ? plugin.suffixUrl(plugins) : '';

        const destination = `/plugins/${get(plugin, 'id')}${pluginSuffixUrl}`;

        return (
          <LeftMenuLink
            {...rest}
            key={get(plugin, 'id')}
            icon={get(plugin, 'icon') || 'plug'}
            label={get(plugin, 'name')}
            destination={destination}
            pluginSuffixUrl={pluginSuffixUrl}
            suffixUrlToReplaceForLeftMenuHighlight={
              plugin.suffixUrlToReplaceForLeftMenuHighlight || ''
            }
          />
        );
      }
    })
  ) : (
    <li key="emptyList" className="noPluginsInstalled">
      <FormattedMessage {...messages.noPluginsInstalled} key="noPlugins" />.
    </li>
  );

  const staticLinks = [
    {
      icon: 'list',
      label: messages.listPlugins.id,
      destination: '/list-plugins',
      requireAdmin: true
    },
    {
      icon: 'shopping-basket',
      label: messages.installNewPlugin.id,
      destination: '/marketplace',
      requireAdmin: true
    },
  ];

  return (
    <Wrapper>
      {linkSections}
      <div>
        <p className="title">
          <FormattedMessage {...messages.plugins} />
        </p>
        <ul className="list">{pluginsLinks}</ul>
      </div>
      <div>
        <p className="title">
          <FormattedMessage {...messages.general} />
        </p>
        <ul className="list">
          {staticLinks.map(link => {
            if (link.requireAdmin && get(auth.getUserInfo(), 'admin_layout') !== ADMIN_ROLE.ADMIN) return null;

            return <LeftMenuLink {...rest} key={link.destination} {...link} />
          })}
        </ul>
      </div>
    </Wrapper>
  );
}

LeftMenuLinkContainer.propTypes = {
  plugins: PropTypes.object.isRequired,
};

export default LeftMenuLinkContainer;
