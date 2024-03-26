# Managed by Ansible - DO NOT EDIT
#
# Created 2019-05-01 by Jorgen Bjornstrup (jorgen@its.aau.dk)
#
# $Id: conf-00README.txt.j2,v 1.3 2020/04/01 13:05:37 jorgen Exp $

# All *.conf files in this directory, i.e., all the
# /srv/www/cs-24-sw-2-06.p2datsw.cs.aau.dk/conf-http/*.conf files,
# will be included in the Apache VirtualHost configuration for the
# http://cs-24-sw-2-06.p2datsw.cs.aau.dk/ website.
#
# The configuration files should only be modified or edited by members
# of the p2datsw-staff group, which can also run
# configuration tests, enable and disable modules, reload or restart
# the webserver, etc., to verify and activate configuration changes.
#
# A number of *.conf and *.conf.example files might be created by
# Ansible, as customized initial default configuration files and
# customized example configuration files, respectively, provided that
# this is configured in the Ansible configuration for the website.
#
# The *.conf files will not subsequently be modified by Ansible,
# unless stated in the files, so they can freely be edited and
# modified, e.g., to comment in, comment out, or add configuration
# lines, whereas the *.conf.example files will be managed and updated
# by Ansible to contain the most recent customized example
# configurations, which might be used as examples to manually update
# the corresponding *.conf configuration files.
#
# To enable or disable an entire configuration file, just change the
# extension to or from .conf, respectively, e.g., by changing the
# .conf.example extension to .conf to enable an example configration.
# Some configuration changes might also require corresponding Apache
# modules, etc., to be enabled or disabled using the a2en* and a2dis*
# commands, which generally in turn require use of the sudo command.
#
# Please note, however, that Ansible might be configured to ensure the
# presence of some of the configuration files for this specific
# website, so these configuration files should not be renamed nor
# removed, since they might subsequently be recreated with the
# customized default configurations at any time.  If Ansible is
# configured to ensure the presence of a specific *.conf file for a
# specific website then that *.conf file, and in particular the
# corresponding updated *.conf.example file, will contain a section
# about the adjured presence of the *.conf file.  Conversely, if
# Ansible is configured to ensure the absence of a specific *.conf
# file for a specific website then any such *.conf file, as well as
# any corrsponding *.conf.example file, might be removed at any time,
# though with a timestamped backup of the file remaining.
#
# After any changes to these configurations files, check that they are
# OK with the following command:
#
# sudo apache2ctl configtest
#
# Then either reload or restart the web server with one of the
# following commands:
#
# sudo service apache2 reload
# sudo service apache2 restart
